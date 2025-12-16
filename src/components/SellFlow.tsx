'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowUpRight, ArrowDownRight, DollarSign, Zap, SlidersHorizontal } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type SellItem = {
  id: string;
  title: string;
  premium_paid: number;
  current_value: number;
  inventory_id: string;
  contract_id?: string;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export function SellFlow() {
  const [items, setItems] = useState<SellItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState<string | null>(null);
  const [limitPrice, setLimitPrice] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('portfolio_view') // adapt to your table/view containing owned options
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      if (!error && data) {
        setItems(data as SellItem[]);
      } else {
        // Fallback Mock for Demo
        setItems([
           { id: '1', title: 'Canadiens · R1', premium_paid: 47, current_value: 63, inventory_id: 'mtl-r1', contract_id: 'MTL-R1-G1-8842' }
        ]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleInstantSell = async (item: SellItem) => {
    setBusyId(item.id);
    const { error } = await supabase.rpc('place_instant_sell', {
      option_id: item.id,
      inventory_id: item.inventory_id,
    });
    setBusyId(null);
    if (error) {
      alert("Erreur technique. Réessayez.");
      return;
    }
    alert(`Vendu pour ${formatCurrency(item.current_value)}!`);
  };

  const handleLimitSellSubmit = async () => {
     if (!showLimitModal || !limitPrice) return;
     const item = items.find(i => i.id === showLimitModal);
     if (!item) return;

     setBusyId(item.id);
     // Simulate API call
     await new Promise(r => setTimeout(r, 1000));
     
     setBusyId(null);
     setShowLimitModal(null);
     alert(`Ordre limite placé à ${formatCurrency(parseFloat(limitPrice))}`);
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && !loading && (
        <div className="bg-surface/50 border border-white/5 p-6 rounded-2xl text-center">
           <p className="text-zinc-500 text-sm">Aucun actif disponible à la vente.</p>
        </div>
      )}

      {items.map((item) => {
        const delta = item.current_value - item.premium_paid;
        const up = delta >= 0;
        
        return (
          <motion.div
            layout
            key={item.id}
            className="bg-surface border border-white/5 rounded-2xl p-4 active:scale-[0.99] transition-transform"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-white mb-1 uppercase tracking-tight">{item.title}</h3>
                <div className="text-xs text-zinc-500 font-mono">Contract: {item.contract_id || item.inventory_id.toUpperCase()}</div>
              </div>
              <div className="text-right">
                 <div className="font-mono font-bold text-white">{formatCurrency(item.current_value)}</div>
                 <div className={`text-xs font-mono ${up ? 'text-accent' : 'text-danger'}`}>
                    {up ? '+' : ''}{formatCurrency(delta)}
                 </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleInstantSell(item)}
                disabled={busyId === item.id}
                className="flex-1 py-3 bg-white text-black font-bold rounded-xl text-xs uppercase flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" fill="black" />
                {busyId === item.id ? '...' : 'Vente Instant'}
              </button>
              <button
                onClick={() => setShowLimitModal(item.id)}
                className="flex-1 py-3 bg-zinc-800 text-zinc-300 font-bold rounded-xl text-xs uppercase flex items-center justify-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Prix Limite
              </button>
            </div>
          </motion.div>
        );
      })}

      {/* Limit Price Modal */}
      <AnimatePresence>
         {showLimitModal && (
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
            >
               <div className="bg-surface border border-white/10 w-full max-w-sm rounded-3xl p-6">
                  <h3 className="text-xl font-black text-white mb-4 uppercase">Définir votre prix</h3>
                  
                  <div className="relative mb-6">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                     <input 
                        type="number" 
                        value={limitPrice}
                        onChange={(e) => setLimitPrice(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-8 pr-4 text-2xl font-mono text-white focus:border-accent outline-none"
                        placeholder="0.00"
                        autoFocus
                     />
                  </div>

                  <div className="space-y-3">
                     <button 
                        onClick={handleLimitSellSubmit}
                        className="w-full py-4 bg-accent text-black font-bold rounded-xl uppercase"
                     >
                        Placer l'ordre
                     </button>
                     <button 
                        onClick={() => setShowLimitModal(null)}
                        className="w-full py-4 text-zinc-500 font-bold uppercase"
                     >
                        Annuler
                     </button>
                  </div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
