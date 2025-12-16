'use client';

import { Star, Users, Sparkles, Ticket, Bell, TrendingUp, Check, Shield } from 'lucide-react';
import { useState } from 'react';
import { joinWaitlist } from '@/lib/supabase/client';
import { VictoryCard } from './VictoryCard';
import { PriceChart } from './PriceChart';
import { motion, AnimatePresence } from 'framer-motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

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

interface ProductCardProps {
  product: Product;
}

function formatPrice(price: number): string {
  // If price is a round number, show no decimals.
  const hasDecimals = price % 1 !== 0;
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(price);
}

function getTagIcon(tag: string) {
  if (tag.toLowerCase().includes('vip') || tag.toLowerCase().includes('inclusive')) {
    return <Star className="w-3 h-3 text-accent" />;
  }
  if (tag.toLowerCase().includes('ambiance') || tag.toLowerCase().includes('fan')) {
    return <Users className="w-3 h-3 text-accent" />;
  }
  return <Sparkles className="w-3 h-3 text-accent" />;
}

export function ProductCard({ product }: ProductCardProps) {
  const isAvailable = product.status === 'available';
  const remaining = product.remaining ?? 0;
  const isLowStock = remaining <= 3 && isAvailable;

  const [showWaitlistInput, setShowWaitlistInput] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [autoClaim, setAutoClaim] = useState(true);

  const handleReserve = () => {
    if (!isAvailable) return;
    Haptics.impact({ style: ImpactStyle.Light });
    setShowConfirm(true); 
  };

  const confirmReserve = () => {
    if (!isAvailable) return;
    Haptics.impact({ style: ImpactStyle.Medium });
    if (product.stripeLink) {
      window.location.href = product.stripeLink; 
    } else {
      alert('Erreur: Lien de paiement non configuré');
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) return;

    const result = await joinWaitlist(waitlistEmail, product.id, product.section);
    
    if (result.success) {
      setWaitlistSubmitted(true);
      setShowVictory(true);
      setTimeout(() => {
        setShowWaitlistInput(false);
        setWaitlistSubmitted(false);
        setWaitlistEmail('');
      }, 3000);
    } else {
      alert('Erreur lors de l\'inscription. Réessayez.');
    }
  };

  return (
    <motion.div 
      layout
      className={`relative bg-surface border border-white/5 rounded-3xl overflow-hidden active:scale-[0.98] transition-all`}
    >
      {/* Victory overlay */}
      {showVictory && (
        <VictoryCard
          title="VOUS ÊTES VERROUILLÉ!"
          subtitle={product.section}
          message="Vous serez alerté dès que des places se libèrent. Pas de stress, pas de scalpers."
          onClose={() => setShowVictory(false)}
        />
      )}

      {/* Detail overlay */}
      <AnimatePresence>
        {showDetail && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl flex flex-col pt-safe-top px-5 pb-5 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
               <button onClick={() => setShowDetail(false)} className="text-sm font-bold text-zinc-400">Fermer</button>
               <div className="text-xs font-mono text-zinc-500 uppercase">Contract: {product.id.toUpperCase()}</div>
            </div>

            <div className="flex-1 space-y-6">
               <div>
                 <h2 className="text-3xl font-black uppercase leading-none mb-2" style={{ fontFamily: 'var(--font-archivo)' }}>{product.section}</h2>
                 <p className="text-zinc-400 text-sm">{product.desc}</p>
               </div>

               <div className="bg-zinc-900/50 rounded-2xl p-4 border border-white/5">
                 <PriceChart inventoryId={product.id} width={300} height={120} color="#10B981" />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4">
                     <div className="text-[10px] font-bold text-accent uppercase mb-1">Entry Price (Now)</div>
                     <div className="text-2xl font-black text-white">{formatPrice(product.price)}</div>
                  </div>
                  <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 relative overflow-hidden">
                     <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1 flex items-center gap-1">Pay Later <Shield className="w-3 h-3"/></div>
                     <div className="text-2xl font-black text-zinc-400">{product.faceValue ? formatPrice(product.faceValue) : '-'}</div>
                     <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="bg-black/80 px-2 py-1 rounded text-[10px] font-mono border border-white/10">IF CONFIRMED</span>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                 <h3 className="text-sm font-bold text-zinc-500 uppercase">Détails de la réservation</h3>
                 <div className="flex items-center gap-3 text-sm text-zinc-400">
                    <Check className="w-4 h-4 text-accent" />
                    <span>Verified Broker (Licence #8842)</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm text-zinc-400">
                    <Check className="w-4 h-4 text-accent" />
                    <span>Livraison garantie par Straddle</span>
                 </div>
               </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleReserve}
                disabled={!isAvailable}
                className={`w-full py-4 rounded-2xl font-bold text-black uppercase tracking-wide ${isAvailable ? 'bg-accent hover:bg-accent-hover' : 'bg-zinc-800 text-zinc-500'}`}
              >
                {isAvailable ? `Réserver pour ${formatPrice(product.price)}` : 'Sold Out'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm overlay (3 taps flow) */}
      <AnimatePresence>
      {showConfirm && (
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed inset-0 z-[60] bg-black flex flex-col justify-end"
        >
          <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="bg-surface border-t border-white/10 p-6 pb-safe-bottom rounded-t-[32px]">
            <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mb-6" />
            
            <div className="text-center mb-8">
               <h3 className="text-xl font-black uppercase mb-2">{product.section}</h3>
               <div className="text-sm text-zinc-400">Confirmation de réservation</div>
            </div>

            <div className="space-y-4 mb-8">
               <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-zinc-400">Entry Price (Today)</span>
                  <span className="text-xl font-bold text-white">{formatPrice(product.price)}</span>
               </div>
               <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-zinc-400">Pay Later (If Confirmed)</span>
                  <span className="text-zinc-500 font-mono">{formatPrice(product.faceValue || 0)}</span>
               </div>
               
               <div className="flex items-center justify-between py-2">
                  <div className="flex flex-col">
                     <span className="text-sm font-bold text-white">Concierge</span>
                     <span className="text-xs text-zinc-500">Relax. We'll buy the ticket for you.</span>
                  </div>
                  <button 
                    onClick={() => setAutoClaim(!autoClaim)}
                    className={`w-12 h-7 rounded-full transition-colors relative ${autoClaim ? 'bg-accent' : 'bg-zinc-700'}`}
                  >
                     <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${autoClaim ? 'left-6' : 'left-1'}`} />
                  </button>
               </div>
               
               {/* Visual Connector Line */}
               <div className="relative py-4 flex flex-col items-center">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-accent to-zinc-800" />
                  <div className="text-[10px] font-mono text-zinc-500 bg-black px-2 z-10">UNLOCKS</div>
                  <div className="w-0.5 h-8 bg-zinc-800" />
               </div>
            </div>

            <div className="space-y-3">
               <button
                  onClick={confirmReserve}
                  className="w-full py-4 bg-accent text-black font-black rounded-2xl text-lg uppercase flex items-center justify-center gap-2"
               >
                  <span className="text-xl">Face ID</span>
                  <span>Confirmer {formatPrice(product.price)}</span>
               </button>
               <button
                  onClick={() => setShowConfirm(false)}
                  className="w-full py-4 text-zinc-500 font-bold uppercase"
               >
                  Annuler
               </button>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Main Card Content (Compact for Mobile) */}
      <div className="p-5" onClick={() => isAvailable ? setShowDetail(true) : null}>
        <div className="flex justify-between items-start mb-3">
           <div>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                {product.desc.split('·')[0]}
              </div>
              <h3 className="text-lg font-black text-white leading-tight uppercase">
                {product.section}
              </h3>
           </div>
           {isLowStock ? (
             <div className="bg-accent/10 text-accent text-[10px] font-bold px-2 py-1 rounded border border-accent/20">
               {remaining} LEFT
             </div>
           ) : !isAvailable ? (
             <div className="bg-zinc-800 text-zinc-500 text-[10px] font-bold px-2 py-1 rounded">
               SOLD OUT
             </div>
           ) : null}
        </div>

        <div className="flex items-end justify-between">
           <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 uppercase font-mono mb-0.5">Entry Price</span>
              <span className="text-xl font-black text-white">{formatPrice(product.price)}</span>
           </div>
           
           {isAvailable ? (
             <button 
               className="bg-white/5 hover:bg-white/10 text-white p-2 rounded-xl transition-colors"
               onClick={(e) => {
                 e.stopPropagation();
                 handleReserve();
               }}
             >
                <TrendingUp className="w-5 h-5" />
             </button>
           ) : (
             <button 
                className="text-zinc-600 p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowWaitlistInput(true);
                }}
             >
                <Bell className="w-5 h-5" />
             </button>
           )}
        </div>
      </div>
      
      {/* Waitlist Modal (Inline logic preserved but hidden in simplified view) */}
      {showWaitlistInput && !isAvailable && (
        <div className="absolute inset-0 bg-surface z-10 p-5 flex flex-col justify-center">
            <h4 className="text-sm font-bold text-white mb-2 uppercase">M'avertir</h4>
            <form onSubmit={handleWaitlistSubmit} className="space-y-3">
               <input
                  type="email"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-accent outline-none"
               />
               <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-white text-black font-bold py-3 rounded-xl text-sm">Notifier</button>
                  <button type="button" onClick={() => setShowWaitlistInput(false)} className="px-4 py-3 bg-zinc-800 rounded-xl text-zinc-400">✕</button>
               </div>
            </form>
        </div>
      )}
    </motion.div>
  );
}
