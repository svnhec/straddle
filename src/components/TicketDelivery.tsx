'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Ticket as TicketIcon, QrCode, MapPin, PhoneCall, Wallet, Gift } from 'lucide-react';
import { VictoryCard } from './VictoryCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

type TicketItem = {
  id: string;
  title: string;
  event_date?: string;
  venue?: string;
  section?: string;
  row?: string;
  seat?: string;
  qr_code_url?: string;
  wallet_url?: string;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export function TicketDelivery() {
  const [items, setItems] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<TicketItem | null>(null);
  const [showUnboxing, setShowUnboxing] = useState(false);

  useEffect(() => {
    const load = async () => {
      // Expect a "tickets_view" or adapt to your table storing delivered tickets
      const { data, error } = await supabase
        .from('tickets_view')
        .select('*')
        .order('event_date', { ascending: true })
        .limit(3);

      if (!error && data) {
        setItems(data as TicketItem[]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleScanClick = async (item: TicketItem) => {
    await Haptics.impact({ style: ImpactStyle.Heavy });
    // Trigger unboxing animation if it's the first time (simulated)
    // For now, just show the unboxing modal logic
    setActive(item);
    setShowUnboxing(true);
    setTimeout(() => {
       Haptics.notification({ type: NotificationType.Success });
    }, 600);
  };

  return (
    <div className="space-y-4 px-5">
      {items.length === 0 && !loading && (
         <div className="py-12 flex flex-col items-center justify-center text-center opacity-50">
            <TicketIcon className="w-16 h-16 text-zinc-600 mb-4" strokeWidth={1} />
            <h3 className="text-lg font-bold text-white mb-2">Aucun billet pour l'instant</h3>
            <p className="text-zinc-500 text-sm max-w-xs">Vos futurs billets apparaîtront ici dès que vos réservations seront confirmées.</p>
         </div>
      )}

      {items.map((item) => (
        <motion.div
          layout
          key={item.id}
          className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden relative"
        >
          {/* Ticket Header stub */}
          <div className="bg-white/5 p-4 border-b border-white/5 border-dashed flex justify-between items-center">
             <div className="text-xs font-bold text-accent uppercase tracking-wider">Confirmé</div>
             <div className="text-xs text-zinc-500 font-mono">{item.event_date ? new Date(item.event_date).toLocaleDateString() : 'Date TBD'}</div>
          </div>

          <div className="p-5">
             <h3 className="text-xl font-black text-white mb-1 uppercase tracking-tight">{item.title}</h3>
             <p className="text-sm text-zinc-400 mb-6">{item.venue || 'Centre Bell, Montréal'}</p>

             <div className="flex justify-between gap-2 mb-6">
                <div className="bg-black/40 rounded-lg p-3 flex-1 text-center">
                   <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Sec</div>
                   <div className="text-lg font-bold text-white font-mono">{item.section || '-'}</div>
                </div>
                <div className="bg-black/40 rounded-lg p-3 flex-1 text-center">
                   <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Rang</div>
                   <div className="text-lg font-bold text-white font-mono">{item.row || '-'}</div>
                </div>
                <div className="bg-black/40 rounded-lg p-3 flex-1 text-center">
                   <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Siège</div>
                   <div className="text-lg font-bold text-white font-mono">{item.seat || '-'}</div>
                </div>
             </div>

             <div className="flex gap-3">
               <button 
                  onClick={() => handleScanClick(item)}
                  className="flex-1 py-3 bg-white text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
               >
                  <Gift className="w-4 h-4" />
                  Ouvrir le billet
               </button>
               <button className="w-12 flex items-center justify-center bg-zinc-800 rounded-xl border border-white/5">
                  <Wallet className="w-5 h-5 text-white" />
               </button>
             </div>
          </div>

          {/* Decorative notches */}
          <div className="absolute top-[52px] -left-3 w-6 h-6 bg-black rounded-full" />
          <div className="absolute top-[52px] -right-3 w-6 h-6 bg-black rounded-full" />
        </motion.div>
      ))}

      {/* QR / Unboxing Modal */}
      <AnimatePresence>
      {active && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
        >
           <motion.div 
             initial={{ scale: 0.8, rotateX: 90 }}
             animate={{ scale: 1, rotateX: 0 }}
             transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
             className="w-full max-w-sm bg-white rounded-3xl p-8 relative flex flex-col items-center overflow-hidden"
           >
              {/* Holographic Sheen Effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />

              <button 
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-black/5 rounded-full flex items-center justify-center text-black font-bold z-10"
              >
                ✕
              </button>

              <h3 className="text-black font-black text-xl mb-1 uppercase tracking-tight relative z-10">{active.title}</h3>
              <p className="text-zinc-500 text-sm mb-6 relative z-10">{active.venue}</p>

              <div className="bg-black p-4 rounded-xl mb-4 relative z-10 shadow-2xl">
                 <img
                  src={active.qr_code_url || 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=STRADDLE'}
                  alt="QR Code"
                  className="w-48 h-48 mix-blend-screen"
                />
              </div>

              <div className="text-center relative z-10">
                 <p className="text-xs text-zinc-400 font-mono mb-2">SCANNEZ À L'ENTRÉE</p>
                 <div className="animate-pulse w-full h-1 bg-accent rounded-full" />
              </div>
           </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
