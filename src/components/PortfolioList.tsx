'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowUpRight, ArrowDownRight, Wallet, Ticket, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';
import { PriceChart } from './PriceChart';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { motion } from 'framer-motion';

type Status = 'awaiting' | 'ready' | 'exercised' | 'expired';

type PortfolioRow = {
  id: string;
  title: string;
  status: Status;
  premium_paid: number;
  current_value: number;
  inventory_id: string;
  contract_id?: string;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export function PortfolioList() {
  const [rows, setRows] = useState<PortfolioRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock total balance for effect
  const totalBalance = 1245.50;
  const dayChange = 212.45;
  const dayChangePercent = 18.4;

  useEffect(() => {
    const load = async () => {
      // Use mock data if no view exists or empty
      const { data, error } = await supabase
        .from('portfolio_view')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (!error && data && data.length > 0) {
        setRows(data as PortfolioRow[]);
      } else {
        // Fallback Mock
        setRows([
          { 
            id: '1', 
            title: 'Canadiens · Round 1', 
            status: 'awaiting', 
            premium_paid: 47, 
            current_value: 63, 
            inventory_id: 'mtl-r1',
            contract_id: 'MTL-R1-G1-8842'
          },
          { 
            id: '2', 
            title: 'Oilers · Finals', 
            status: 'ready', 
            premium_paid: 89, 
            current_value: 210, 
            inventory_id: 'edm-fin',
            contract_id: 'EDM-F-G1-1204'
          },
        ]);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading Skeleton Header */}
        <div className="mx-5 p-6 rounded-3xl bg-zinc-900 border border-white/5 relative overflow-hidden animate-pulse">
          <div className="h-4 w-24 bg-zinc-800 rounded mb-2"></div>
          <div className="h-10 w-48 bg-zinc-800 rounded mb-2"></div>
          <div className="h-4 w-32 bg-zinc-800 rounded"></div>
        </div>
        {/* Loading Skeleton List */}
        <div className="space-y-2 px-5">
           {[1, 2, 3].map((i) => (
             <div key={i} className="h-20 bg-zinc-900 rounded-2xl animate-pulse"></div>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Header Card */}
      <div className="mx-5 p-6 rounded-3xl bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10">
          <p className="text-zinc-400 text-sm font-medium mb-1">Valeur Totale</p>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2" style={{ fontFamily: 'var(--font-archivo)' }}>
            {formatCurrency(totalBalance)}
          </h2>
          <div className="flex items-center gap-2 text-accent text-sm font-bold font-mono">
            <TrendingUp className="w-4 h-4" />
            <span>+{formatCurrency(dayChange)} ({dayChangePercent}%)</span>
            <span className="text-zinc-500 font-normal">Aujourd'hui</span>
          </div>
        </div>

        {/* Mini chart background decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20">
           <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full text-accent fill-current">
              <path d="M0 20 L0 15 Q 10 10, 20 12 T 40 8 T 60 14 T 80 5 T 100 10 L 100 20 Z" />
           </svg>
        </div>
      </div>

      {/* Assets List */}
      <div className="space-y-2">
        <div className="px-5 text-sm font-bold text-zinc-500 font-mono uppercase tracking-wider">Vos Réservations</div>
        
        {rows.map((row) => {
           const delta = row.current_value - row.premium_paid;
           const isUp = delta >= 0;

           return (
             <motion.div 
               layout
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               key={row.id} 
               className="mx-2 px-4 py-4 hover:bg-zinc-900/40 rounded-2xl transition-colors cursor-pointer group flex justify-between items-center active:scale-[0.98]"
             >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold border border-white/5 ${row.status === 'ready' ? 'bg-accent/10 text-accent animate-pulse-subtle' : 'bg-zinc-800 text-zinc-400'}`}>
                    {row.status === 'ready' ? '⚡' : row.status === 'exercised' ? <CheckCircle className="w-5 h-5"/> : '🎟'}
                  </div>
                  <div>
                    <h3 className="font-bold text-white leading-tight">{row.title}</h3>
                    <div className="text-xs text-zinc-500 font-mono flex items-center gap-2 mt-1">
                      <span className={row.status === 'ready' ? 'text-accent font-bold' : ''}>
                        {row.status === 'ready' ? 'READY TO CLAIM' : row.status === 'awaiting' ? 'AWAITING PLAYOFFS' : row.status.toUpperCase()}
                      </span>
                    </div>
                    {row.contract_id && <div className="text-[10px] text-zinc-600 font-mono mt-0.5">{row.contract_id}</div>}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-white text-base">
                    {formatCurrency(row.current_value)}
                  </div>
                  <div className={`text-xs font-mono font-medium ${isUp ? 'text-accent' : 'text-danger'}`}>
                    {isUp ? '+' : ''}{formatCurrency(delta)}
                  </div>
                </div>
             </motion.div>
           );
        })}
      </div>
    </div>
  );
}
