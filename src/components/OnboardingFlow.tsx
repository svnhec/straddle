'use client';

import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { ChevronRight, Shield, Check, Star, ArrowRight, Lock, Bell, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Screen = 'landing' | 'teams' | 'done';

const TEAMS = [
  { id: 'mtl', name: 'Canadiens', emoji: '🏒' },
  { id: 'tor', name: 'Maple Leafs', emoji: '🍁' },
  { id: 'bos', name: 'Bruins', emoji: '🐻' },
  { id: 'nyr', name: 'Rangers', emoji: '🗽' },
  { id: 'van', name: 'Canucks', emoji: '🌲' },
  { id: 'edm', name: 'Oilers', emoji: '🛢️' },
];

export function OnboardingFlow({ onComplete }: { onComplete?: () => void }) {
  const [screen, setScreen] = useState<Screen>('landing');
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [soldOut, setSoldOut] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      // Fetch the first available 'pass_priority' or just the first item
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .limit(1)
        .single();

      if (data) {
        setProduct(data);
        setSoldOut(data.status === 'sold_out');
      }
      setLoading(false);
    };

    fetchProduct();
    
    // Realtime subscription for status updates
    const channel = supabase
      .channel('landing-page-inventory')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'inventory' }, (payload) => {
         if (product && payload.new.id === product.id) {
            setSoldOut(payload.new.status === 'sold_out');
            setProduct(payload.new);
         } else if (!product) {
            // Initial load happened after, or we just got a relevant update
            setProduct(payload.new);
            setSoldOut(payload.new.status === 'sold_out');
         }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [product]);
  
  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as any)[0].value;
    
    // Simple check if email or phone
    // We store both in 'email' column for now or 'contact_info' if we had it, 
    // but the joinWaitlist function expects email. 
    // Let's assume the user enters an email or we handle it on backend.
    // Ideally we should have a 'contact' column.
    // For now we use the joinWaitlist function from client.ts which inserts into 'waitlist' table.
    // We'll construct a mock product ID if none fetched, but we should have one.
    
    const productId = product?.id || 'unknown';
    const productName = product?.title || 'Passe Prioritaire';

    const { error } = await supabase
        .from('waitlist')
        .insert([{ email: input, product_id: productId, product_name: productName }]);

    if (error) {
       console.error(error);
       alert("Erreur lors de l'inscription. Réessayez.");
    } else {
       alert("Vous êtes sur la liste d'attente !");
    }
  };

  const handleReserveClick = () => {
    if (!product) return;
    if (product.stripe_link) {
        window.location.href = product.stripe_link;
    } else {
        // Fallback or alert
        console.warn('No stripe link found');
    }
  };

  const toggleTeam = (id: string) => {
    setSelectedTeams((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const goNext = (next: Screen) => setScreen(next);

  // Auth Selection View removed


  if (screen === 'landing') {
    // Custom blue for the aggressive sporty look (approx Electric Blue)
    const sportBlue = '#2563EB';

    return (
      <div className="min-h-screen bg-black text-white selection:bg-blue-600/30">
        {/* Navigation / Header */}
        <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
           <h1 className="text-2xl font-black tracking-tighter uppercase italic" style={{ fontFamily: 'var(--font-archivo)' }}>STRADDLE</h1>
           <div className="hidden md:block text-xs font-bold uppercase tracking-wider text-white/50 border border-white/10 px-3 py-1">
             Saison 2025-2026
           </div>
        </nav>

        <main className="max-w-xl mx-auto px-6 pb-20 space-y-24 pt-10">
            <>
              {/* 1. HERO SECTION */}
              <section className="text-center space-y-8 relative">
                 {/* Background Glow & Gradient */}
                 <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-900/20 via-blue-900/5 to-transparent -z-20 pointer-events-none" />
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.2)_0%,rgba(0,0,0,0)_60%)] -z-10 pointer-events-none" />
                 
                 {/* Linear Grid Background Effect */}
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10"></div>
                 
                 <div className="inline-flex items-center justify-center border border-blue-600 text-blue-500 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
                   Drop #1 • Live Now
                 </div>
                
                <h1 className="text-5xl md:text-6xl font-black uppercase leading-[0.9] tracking-tighter" style={{ fontFamily: 'var(--font-archivo)' }}>
                  SÉCURISEZ <span className="text-blue-600">VOS SIÈGES</span><br />
                  POUR LES SÉRIES 2026.
                </h1>
                
                <p className="text-zinc-400 font-mono text-xs md:text-sm max-w-sm mx-auto leading-relaxed">
                  Oui, croyez-le ou non, c'est possible maintenant. <span className="text-white font-bold">Quantités ultra-limitées.</span>
                </p>

                {/* Stats Grid inspired by screenshot */}
                <div className="grid grid-cols-2 gap-0 border border-white/20 max-w-sm mx-auto bg-black">
                  <div className="p-4 border-r border-white/20 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-blue-500" style={{ fontFamily: 'var(--font-space-mono)' }}>50</span>
                    <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mt-1">Places</span>
                  </div>
                  <div className="p-4 flex flex-col items-center justify-center bg-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 border-2 border-red-500 opacity-20 animate-pulse"></div>
                    <span className="text-2xl font-bold text-red-500" style={{ fontFamily: 'var(--font-space-mono)' }}>24H</span>
                    <span className="text-[9px] uppercase tracking-wider text-red-500 font-bold mt-1 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"/> Deadline
                    </span>
                  </div>
                </div>
              </section>

              {/* 2. PRODUCT SECTION */}
              <section id="product-section" className="space-y-12">
                <div className="text-center">
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-2" style={{ fontFamily: 'var(--font-archivo)' }}>Choisissez Votre Zone</h3>
                  <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Réservez aujourd'hui. Payez le prix officiel si le CH fait les séries.</p>
                </div>

                <div className="border-2 border-white bg-black relative group hover:border-blue-500 transition-colors duration-500 shadow-[0_0_40px_rgba(37,99,235,0.15)]">
                  {/* Badge */}
                  <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3">
                    {soldOut ? 'SOLD OUT' : 'ALMOST GONE'}
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="w-12 h-12 border border-white/20 flex items-center justify-center text-zinc-700">
                           <Ticket className="w-6 h-6" strokeWidth={1} />
                        </div>
                        <div>
                          <h2 className="text-3xl font-black uppercase leading-none mb-2 italic" style={{ fontFamily: 'var(--font-archivo)' }}>
                            PASSE PRIORITAIRE
                          </h2>
                          <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Accès Global • Ronde 1 (Domicile)</p>
                        </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex gap-2">
                       <span className="border border-white/20 px-2 py-1 text-[10px] uppercase font-bold text-zinc-400">Best Seller</span>
                       <span className="border border-white/20 px-2 py-1 text-[10px] uppercase font-bold text-zinc-400">Niveau 100/300/400</span>
                    </div>

                    <div className="h-px w-full bg-transparent border-t border-dashed border-zinc-700 my-6" />

                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-[10px] font-bold uppercase text-blue-500 mb-1 tracking-wider">Dépôt Aujourd'hui</div>
                        <div className="text-5xl font-black text-white" style={{ fontFamily: 'var(--font-archivo)' }}>
                          {product ? Math.floor(product.price) : 50}<span className="text-2xl align-top">$</span>
                        </div>
                      </div>
                      <div className="text-right pb-1 max-w-[50%]">
                        <div className="text-[10px] font-bold uppercase text-zinc-600 tracking-wider mb-1">Prix Officiel (Avril)</div>
                        <div className="text-[10px] font-bold text-zinc-400 leading-tight uppercase font-mono">
                          Prix à déterminer, mais il sera moins cher qu'ailleurs 100% garanti
                        </div>
                      </div>
                    </div>

                    {soldOut ? (
                      <form onSubmit={handleWaitlistSubmit} className="space-y-0">
                        <input type="text" placeholder="COURRIEL OU TÉLÉPHONE" className="w-full bg-transparent border border-white/20 p-4 text-white text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-red-600 placeholder:text-zinc-700 mb-4" required />
                        <button type="submit" className="w-full py-5 bg-transparent border border-blue-600 text-blue-500 font-bold uppercase tracking-widest text-xs hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center gap-3">
                          <Bell className="w-4 h-4" /> M'avertir
                        </button>
                      </form>
                    ) : (
                      <button
                        onClick={handleReserveClick}
                        className="w-full py-5 bg-transparent border border-blue-600 text-blue-500 font-black uppercase tracking-widest text-sm hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-3 group-hover:shadow-[0_0_30px_rgba(37,99,235,0.2)]"
                      >
                         <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse group-hover:bg-white" />
                         Sécuriser ma place
                      </button>
                    )}
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-white/10 p-5 flex items-start gap-4">
                    <Check className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-bold uppercase text-xs text-white mb-1">Priorité Absolue</h4>
                      <p className="text-[10px] text-zinc-500 uppercase font-mono">Accès 24h avant le grand public.</p>
                    </div>
                  </div>
                  <div className="border border-white/10 p-5 flex items-start gap-4">
                    <Check className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-bold uppercase text-xs text-white mb-1">Prix Garanti</h4>
                      <p className="text-[10px] text-zinc-500 uppercase font-mono">20-40% sous le prix StubHub.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. TRUST FOOTER */}
              <section className="border-t border-white/10 pt-8 pb-8 text-center">
                 <div className="inline-flex flex-col items-center gap-3">
                   <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center">
                     <Lock className="w-4 h-4 text-white" />
                   </div>
                   <div>
                     <h4 className="font-bold uppercase text-xs text-white mb-1 tracking-wider">Garantie Risque Zéro</h4>
                     <p className="text-[10px] text-zinc-500 uppercase font-mono max-w-xs mx-auto">
                       Si aucun billet n'est trouvé, votre dépôt de 50$ est remboursé à 100% instantanément.
                     </p>
                   </div>
                 </div>
              </section>
            </>
        </main>
      </div>
    );
  }

  // Original "Teams" and "Done" screens preserved for the flow
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full border border-zinc-900 bg-surface p-6 shadow-[0_0_25px_rgba(0,255,148,0.1)]" style={{ borderRadius: 0 }}>
        
        {screen === 'teams' && (
          <div className="flex flex-col gap-4">
            <div className="text-center">
              <h2 className="text-xl font-black uppercase mb-2" style={{ fontFamily: 'var(--font-archivo), sans-serif' }}>
                Choisis tes équipes (optionnel)
              </h2>
              <p className="text-sm text-zinc-400" style={{ fontFamily: 'var(--font-space-mono), monospace' }}>
                Personnalise ton flux. Tu peux sauter cette étape.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {TEAMS.map((team) => {
                const active = selectedTeams.includes(team.id);
                return (
                  <button
                    key={team.id}
                    onClick={() => toggleTeam(team.id)}
                    className={`border px-2 py-3 flex flex-col items-center gap-1 transition-all ${
                      active ? 'border-accent text-accent bg-accent/10' : 'border-zinc-800 text-zinc-300'
                    }`}
                    style={{ borderRadius: 0, fontFamily: 'var(--font-space-mono), monospace' }}
                  >
                    <span className="text-xl">{team.emoji}</span>
                    <span className="text-xs uppercase tracking-wider">{team.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => goNext('done')}
                className="flex-1 py-3 border border-zinc-800 text-zinc-400 uppercase text-sm font-bold"
                style={{ borderRadius: 0, fontFamily: 'var(--font-space-mono), monospace' }}
              >
                Passer
              </button>
              <button
                onClick={() => goNext('done')}
                className="flex-1 py-3 border border-accent bg-accent text-black uppercase text-sm font-bold hover:bg-accent-hover transition-all"
                style={{ borderRadius: 0, fontFamily: 'var(--font-space-mono), monospace' }}
              >
                Terminé
              </button>
            </div>
          </div>
        )}

        {screen === 'done' && (
          <div className="flex flex-col gap-4 text-center">
            <div className="text-4xl">🎉</div>
            <h3 className="text-xl font-black uppercase" style={{ fontFamily: 'var(--font-archivo), sans-serif' }}>
              Prêt en moins de 20 secondes.
            </h3>
            <p className="text-sm text-zinc-400" style={{ fontFamily: 'var(--font-space-mono), monospace' }}>
              Flux personnalisé, aucune friction. Active les alertes après ta première action (achat ou suivi d’équipe).
            </p>
            <button
              onClick={onComplete}
              className="w-full py-3 bg-accent text-black font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-accent-hover transition-all"
              style={{ borderRadius: 0, fontFamily: 'var(--font-space-mono), monospace' }}
            >
              Entrer dans l’app <ChevronRight className="w-4 h-4" />
            </button>
            <div className="text-xs text-zinc-500 flex items-center gap-2 justify-center" style={{ fontFamily: 'var(--font-space-mono), monospace' }}>
              <Bell className="w-4 h-4 text-accent" />
              Alertes: propose-les après une action, jamais durant l’onboarding.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
