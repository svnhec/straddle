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

export function InventoryGrid({ initialInventory }: { initialInventory: Product[] }) {
  const [inventory, setInventory] = useState<Product[]>(initialInventory);

  useEffect(() => {
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
            // Handle new items if needed (reload or append)
            // For simplicity in MVP, we might just update existing ones, 
            // but let's be safe and just update the state if we find it, or ignore.
            // A full refetch might be safer for INSERTs but UPDATE is what we care about most.
             const newItem = payload.new as InventoryItem;
             // Add only if not exists
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {inventory.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      
      {inventory.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-zinc-500">Chargement des options...</p>
        </div>
      )}
    </div>
  );
}
