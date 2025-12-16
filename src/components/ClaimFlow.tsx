'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Clock, Shield, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

type ClaimStatus = 'ready' | 'claimed' | 'expired';

type ClaimItem = {
  id: string;
  title: string;
  event_date?: string;
  reserved_price: number;
  market_price: number;
  status: ClaimStatus;
  claim_start?: string;
  claim_end?: string;
  inventory_id: string;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export function ClaimFlow() {
  const [items, setItems] = useState<ClaimItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('claims_view')
        .select('*')
        .order('claim_start', { ascending: true })
        .limit(5);

      if (!error && data) {
        setItems(data as ClaimItem[]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleClaim = async (id: string) => {
    setBusyId(id);
    const { error } = await supabase.rpc('claim_ticket', { claim_id: id });
    setBusyId(null);
    if (error) {
      alert("Erreur technique. Réessayez.");
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'claimed' } : i)));
  };

  const handleSellInstead = async (id: string) => {
    setBusyId(id);
    const { error } = await supabase.rpc('sell_instead', { claim_id: id });
    setBusyId(null);
    if (error) {
      alert("Erreur technique. Réessayez.");
      return;
    }
    alert('Vente initiée.');
  };

  return (
    <div className="space-y-4 px-5">
      {items.length === 0 && !loading && (
         <div className="py-8 text-center opacity-50">
            <h3 className="text-lg font-bold text-white mb-2">Aucune réclamation active</h3>
            <p className="text-zinc-500 text-sm">Nous vous notifierons quand il sera temps de réclamer vos billets.</p>
         </div>
      )}

      {items.map((item) => {
        const savings = item.market_price - item.reserved_price;
        
        return (
          <motion.div
            layout
            key={item.id}
            className="bg-surface border border-white/5 rounded-3xl overflow-hidden shadow-lg"
          >
            <div className="bg-accent/10 p-4 flex justify-between items-center border-b border-accent/10">
               <div className="flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-wide">
                  <Clock className="w-4 h-4" />
                  <span>Fenêtre active</span>
               </div>
               <div className="text-xs font-mono text-accent/80">
                  Reste 2j 14h
               </div>
            </div>

            <div className="p-5">
              <h3 className="text-xl font-black text-white mb-1 uppercase tracking-tight">{item.title}</h3>
              <p className="text-sm text-zinc-400 mb-6 font-mono">
                {item.event_date ? new Date(item.event_date).toLocaleDateString() : 'Date TBD'}
              </p>

              <div className="bg-zinc-900 rounded-2xl p-4 mb-6 border border-white/5">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-zinc-500 text-sm">Prix Réservé (Pay Later)</span>
                    <span className="text-white font-bold">{formatCurrency(item.reserved_price)}</span>
                 </div>
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-zinc-500 text-sm">Prix Marché Actuel</span>
                    <span className="text-zinc-400 font-mono line-through decoration-danger">{formatCurrency(item.market_price)}</span>
                 </div>
                 <div className="flex justify-between items-center pt-3 border-t border-white/5">
                    <span className="text-accent font-bold uppercase tracking-wide text-sm">Votre Économie</span>
                    <span className="text-accent font-black text-xl">+{formatCurrency(savings)}</span>
                 </div>
              </div>

              <div className="space-y-3">
                 {item.status === 'ready' && (
                    <>
                      <button 
                        onClick={() => handleClaim(item.id)}
                        disabled={busyId === item.id}
                        className="w-full py-4 bg-white text-black font-black rounded-xl text-lg uppercase shadow-lg active:scale-95 transition-transform"
                      >
                         {busyId === item.id ? 'Traitement...' : `Réclamer · ${formatCurrency(item.reserved_price)}`}
                      </button>
                      <button 
                        onClick={() => handleSellInstead(item.id)}
                        className="w-full py-3 text-zinc-400 font-bold uppercase text-sm hover:text-white transition-colors"
                      >
                         Vendre à la place (~{formatCurrency(savings)})
                      </button>
                    </>
                 )}
                 
                 {item.status === 'claimed' && (
                    <div className="w-full py-4 bg-zinc-800 text-zinc-400 font-bold rounded-xl text-center uppercase flex items-center justify-center gap-2">
                       <CheckCircle className="w-5 h-5" /> Réclamé
                    </div>
                 )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
