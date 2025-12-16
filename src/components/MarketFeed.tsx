'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';

type Direction = 'up' | 'down';

interface FeedItem {
  id: string;
  title: string;
  subtitle: string;
  change: string;
  direction: Direction;
  reason: string;
  updated_at?: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export function MarketFeed() {
  const [items, setItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    const load = async () => {
      // For now, let's keep the mock data or fetch logic but make it look good
      // If DB is empty, use mocks
      const mockItems: FeedItem[] = [
        {
          id: 'mtl-r1-g1',
          title: 'Canadiens',
          subtitle: 'Series A',
          change: '+12.4%',
          direction: 'up',
          reason: 'Win vs OTT',
        },
        {
          id: 'mtl-r2-g1',
          title: 'Maple Leafs',
          subtitle: 'Series B',
          change: '-3.2%',
          direction: 'down',
          reason: 'Matthews Injury',
        },
        {
          id: 'tor-r1-g1',
          title: 'Bruins',
          subtitle: 'Series A',
          change: '+5.1%',
          direction: 'up',
          reason: 'Playoff Spot',
        },
         {
          id: 'nyr',
          title: 'Rangers',
          subtitle: 'Series A',
          change: '+2.1%',
          direction: 'up',
          reason: 'Win Streak',
        },
      ];
      setItems(mockItems);
    };

    load();
  }, []);

  return (
    <div className="w-full overflow-x-auto no-scrollbar pb-2 pl-5 -mr-5">
      <div className="flex gap-3 pr-5" style={{ width: 'max-content' }}>
        {items.map((item, i) => {
          const isUp = item.direction === 'up';
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[140px] h-[100px] p-3 rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-md flex flex-col justify-between active:scale-95 transition-transform"
            >
              <div className="flex justify-between items-start">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-lg">
                   {item.title[0]}
                </div>
                <div className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isUp ? 'bg-accent/10 text-accent' : 'bg-danger/10 text-danger'}`}>
                  {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {item.change}
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-sm leading-tight text-white mb-0.5">{item.title}</h3>
                 <p className="text-[10px] text-zinc-500 font-medium truncate">{item.reason}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
