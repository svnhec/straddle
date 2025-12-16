'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ProductCard } from './ProductCard';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Product {
  id: string;
  section: string;
  desc: string;
  price: number;
  faceValue?: number;
  status: 'available' | 'sold_out';
  tags: string[];
  remaining?: number;
  stripeLink?: string;
}

interface InventoryItem {
  id: string;
  title: string;
  description: string;
  price: number;
  face_value: number;
  status: string;
  tags: string[];
  remaining: number;
  stripe_link: string;
}

export function InventoryGrid({ initialInventory = [] }: { initialInventory?: Product[] }) {
  const [inventory, setInventory] = useState<Product[]>(initialInventory);

  useEffect(() => {
    // Fetch initial data if not provided (or refresh it)
    const fetchInventory = async () => {
      const { data: inventoryData, error } = await supabase
        .from('inventory')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching inventory:', error);
        return;
      }

      const formattedInventory = (inventoryData || []).map((item) => ({
        id: item.id,
        section: item.title,
        desc: item.description,
        price: item.price,
        faceValue: item.face_value,
        status: item.status as 'available' | 'sold_out',
        tags: item.tags || [],
        remaining: item.remaining || 0,
        stripeLink: item.stripe_link,
      }));
      setInventory(formattedInventory);
    };

    fetchInventory();

    console.log('Setting up Realtime subscription...');
    
    const channel = supabase
      .channel('inventory-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'inventory',
        },
        (payload) => {
          console.log('Change received!', payload);
          
          if (payload.eventType === 'UPDATE') {
            const newItem = payload.new as InventoryItem;
            setInventory((currentInventory) =>
              currentInventory.map((item) =>
                item.id === newItem.id
                  ? {
                      id: newItem.id,
                      section: newItem.title,
                      desc: newItem.description,
                      price: newItem.price,
                      faceValue: newItem.face_value,
                      status: newItem.status as 'available' | 'sold_out',
                      tags: newItem.tags || [],
                      remaining: newItem.remaining || 0,
                      stripeLink: newItem.stripe_link,
                    }
                  : item
              )
            );
          } else if (payload.eventType === 'INSERT') {
             const newItem = payload.new as InventoryItem;
             setInventory((current) => {
                if (current.find(i => i.id === newItem.id)) return current;
                return [...current, {
                      id: newItem.id,
                      section: newItem.title,
                      desc: newItem.description,
                      price: newItem.price,
                      faceValue: newItem.face_value,
                      status: newItem.status as 'available' | 'sold_out',
                      tags: newItem.tags || [],
                      remaining: newItem.remaining || 0,
                      stripeLink: newItem.stripe_link,
                }];
             });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-3">
      {inventory.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      
      {inventory.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-500 text-sm">Chargement des réservations...</p>
        </div>
      )}
    </div>
  );
}
