'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

type InventoryRow = {
  id: string;
  title: string;
  description: string;
  price: number;
  face_value: number | null;
  status: 'available' | 'sold_out';
  remaining: number | null;
  stripe_link: string | null;
  previous_price?: number;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Mock Sparkline SVG
const Sparkline = ({ color }: { color: string }) => (
  <svg width="60" height="24" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 20L12 16L22 18L32 10L42 12L52 6L59 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function LiveMarketList() {
  const [rows, setRows] = useState<InventoryRow[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(6);

      if (error || !data) return;
      setRows(data as InventoryRow[]);
    };
    load();
  }, []);

  return (
    <div className="space-y-0.5">
        {rows.length === 0 && (
           <div className="p-4 text-center">
             <div className="animate-pulse bg-zinc-900 h-16 w-full rounded-2xl mb-2"></div>
             <div className="animate-pulse bg-zinc-900 h-16 w-full rounded-2xl mb-2"></div>
             <div className="animate-pulse bg-zinc-900 h-16 w-full rounded-2xl"></div>
           </div>
        )}

        {rows.map((row) => {
          const remaining = row.remaining ?? 0;
          const isAvailable = row.status === 'available';
          const isUp = (row.previous_price ?? 0) < row.price; 
          // Default to up if no history, or logic based on face_value
          
          return (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={row.id}
              onClick={() => {
                if (row.stripe_link && isAvailable) window.location.href = row.stripe_link;
              }}
              className="group flex items-center justify-between py-4 px-2 hover:bg-zinc-900/40 rounded-xl transition-colors active:scale-[0.99] cursor-pointer"
            >
              {/* Left: Icon & Ticker */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center font-bold text-sm text-white">
                  {row.title.substring(0, 3).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white leading-none mb-1">{row.title}</h3>
                  <p className="text-xs text-zinc-500 font-mono">{row.description.split('·')[0]}</p>
                </div>
              </div>

              {/* Middle: Sparkline (Hidden on tiny screens) */}
              <div className="hidden sm:block opacity-50">
                <Sparkline color={isAvailable ? '#00FF94' : '#52525b'} />
              </div>

              {/* Right: Price & Action */}
              <div className="text-right">
                <div className="font-mono font-bold text-white text-sm">
                  {formatCurrency(row.price)}
                </div>
                <div className={`text-xs flex items-center justify-end gap-1 ${isAvailable ? 'text-accent' : 'text-zinc-600'}`}>
                  {isAvailable ? (
                    <>
                       {remaining} restants
                    </>
                  ) : (
                    'Sold out'
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
  );
}
