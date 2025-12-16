'use client';

import { useState } from 'react';
import { ChevronRight, Shield, Check, Star, ArrowRight, Lock, Bell, AlarmClock, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [soldOut, setSoldOut] = useState(false); // Can be toggled for Sold Out state
  
  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Vous êtes sur la liste d'attente ! (Demo)");
  };

  const toggleTeam = (id: string) => {
    setSelectedTeams((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const goNext = (next: Screen) => setScreen(next);

  const handleReserveClick = () => {
    // Direct redirect to Stripe (or payment link) to avoid friction
    // TODO: Replace with real "Passe Prioritaire" Stripe Link
    window.location.href = 'https://buy.stripe.com/test_5kA5mx09a8oF7q87ss'; 
  };

  // Auth Selection View removed


  if (screen === 'landing') {
    return (
      <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
        {/* Navigation / Header */}
        <nav className="p-5 flex justify-between items-center max-w-7xl mx-auto border-b border-white/5">
           <h1 className="text-xl font-black tracking-tighter" style={{ fontFamily: 'var(--font-archivo)' }}>STRADDLE</h1>
           <button 
             onClick={() => window.location.href = '#reserve'}
             className="px-4 py-2 border border-blue-600/30 text-blue-500 text-xs font-bold uppercase tracking-wider hover:bg-blue-600/10 transition-colors"
           >
             RÉSERVER &gt;
           </button>
        </nav>

        <main className="max-w-xl mx-auto px-5 pb-20 space-y-20 pt-10">
            <>
              {/* 1. HERO SECTION */}
              <section className="text-center space-y-8 relative">
                 {/* Background Texture */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,rgba(10,30,60,0.8)_0%,rgba(0,0,0,0)_70%)] -z-10 pointer-events-none" />
                 
                 <div className="inline-block border border-blue-500/30 bg-blue-900/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 mb-4 font-mono">
                   ● Drop #1 • Live Now
                 </div>
                 
                 <h1 className="text-4xl md:text-6xl font-black uppercase leading-[0.9] tracking-tight mb-2" style={{ fontFamily: 'var(--font-archivo)' }}>
                   Sécurisez vos sièges<br />pour les <span className="text-blue-500">Séries 2026.</span>
                 </h1>
                 
                 <p className="text-zinc-400 leading-relaxed font-mono text-sm max-w-sm mx-auto">
                   Oui, croyez le ou non, c'est possible maintenant. <span className="text-white font-bold">Quantités ultra-limitées.</span>
                 </p>

                 {/* Stats Grid */}
                 <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                    <div className="aspect-square border border-white flex flex-col items-center justify-center p-2">
                       <div className="text-3xl font-bold font-mono">50</div>
                       <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono mt-1">Inventaire</div>
                    </div>
                    <div className="aspect-square border border-blue-500 flex flex-col items-center justify-center p-2 text-blue-500">
                       <div className="text-3xl font-bold font-mono">0</div>
                       <div className="text-[10px] uppercase tracking-wider font-mono mt-1">Places</div>
                    </div>
                    <div className="aspect-square border border-red-500 flex flex-col items-center justify-center p-2 text-red-500 relative overflow-hidden">
                       <div className="absolute inset-0 bg-red-500/10 animate-pulse" />
                       <div className="text-3xl font-bold font-mono">24H</div>
                       <div className="text-[10px] uppercase tracking-wider font-mono mt-1 flex items-center gap-1"><AlarmClock className="w-3 h-3" /> Deadline</div>
                    </div>
                 </div>

                 <button
                   onClick={() => window.location.href = '#options'}
                   className="w-full py-5 bg-blue-600 text-white font-black uppercase tracking-wider text-lg hover:bg-blue-500 active:scale-[0.98] transition-all"
                   style={{ fontFamily: 'var(--font-space-mono)' }}
                 >
                   <span className="flex items-center justify-center gap-3">
                     <Ticket className="w-5 h-5" /> VOIR LES OPTIONS
                   </span>
                 </button>
              </section>

              {/* 2. PRODUCT SECTION */}
              <section id="options" className="space-y-8 pt-10">
                <div className="text-center space-y-2">
                   <h2 className="text-2xl font-black uppercase" style={{ fontFamily: 'var(--font-archivo)' }}>Choisissez votre zone</h2>
                   <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">Réservez aujourd'hui. Payez le face value si les Canadiens font les séries.</p>
                </div>

                <div className="bg-black border border-white p-1 relative group hover:border-blue-500 transition-colors">
                  {/* Sold Out Badge */}
                  <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 z-10">
                    {soldOut ? '× Sold Out' : 'Almost Gone'}
                  </div>

                  <div className="p-6 space-y-6">
                    <div>
                      <h2 className="text-xl font-black uppercase leading-none mb-2" style={{ fontFamily: 'var(--font-archivo)' }}>
                        PASSE PRIORITAIRE (ROUGE)
                      </h2>
                      <p className="text-zinc-400 text-sm">Siège garanti niveau glace (Sec 100-124). Vue imprenable.</p>
                      
                      <div className="flex gap-2 mt-4">
                        <span className="border border-white/20 px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-400">Best Seller</span>
                        <span className="border border-white/20 px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-400">Niveau 100</span>
                      </div>
                    </div>

                    <div className="border-t border-dashed border-zinc-800 my-4" />

                    <div className="flex justify-between items-end">
                       <div>
                          <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">Dépôt Aujourd'hui</div>
                          <div className="text-4xl font-black text-white" style={{ fontFamily: 'var(--font-space-mono)' }}>50 $</div>
                       </div>
                       <div className="text-right">
                          <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider mb-1">Prix Officiel à payer en avril</div>
                          <div className="text-xl font-bold text-zinc-500 font-mono line-through">350 $</div>
                       </div>
                    </div>

                    {soldOut ? (
                      <button className="w-full py-4 border border-blue-600 text-blue-500 font-bold uppercase tracking-wider text-sm hover:bg-blue-600/10 transition-colors flex items-center justify-center gap-2">
                        <Bell className="w-4 h-4" /> M'avertir
                      </button>
                    ) : (
                      <button
                        onClick={handleReserveClick}
                        className="w-full py-4 bg-blue-600 text-white font-black uppercase tracking-wider text-sm hover:bg-blue-500 transition-colors"
                      >
                        SÉCURISER MA PLACE
                      </button>
                    )}
                  </div>
                </div>
              </section>

              {/* 3. HOW IT WORKS */}
              <section className="space-y-8">
                <h3 className="text-xl font-black uppercase tracking-wider text-center" style={{ fontFamily: 'var(--font-archivo)' }}>
                  Comment ça marche
                </h3>
                
                <div className="space-y-8 relative">
                   {/* Vertical Line */}
                   <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-zinc-800" />
                   
                   {[
                     { 
                       title: "Achetez votre Passe Prioritaire", 
                       desc: "Pour 50 $ (Dépôt). Sécurisez votre place dans la file d'attente.",
                       icon: "1"
                     },
                     { 
                       title: "Accès Prioritaire", 
                       desc: "Dès que les billets sortent, vous avez la priorité pour choisir vos sièges à prix réduit.",
                       icon: "2"
                     },
                     { 
                       title: "Profitez du Match", 
                       desc: "Payez vos billets et recevez-les 24h avant le match. Économisez des centaines de dollars.",
                       icon: "3"
                     }
                   ].map((step, i) => (
                     <div key={i} className="relative flex gap-5 items-start">
                       <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center font-black text-white shrink-0 z-10">
                         {step.icon}
                       </div>
                       <div>
                         <h4 className="font-bold text-white uppercase mb-1">{step.title}</h4>
                         <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
                       </div>
                     </div>
                   ))}
                </div>
              </section>

              {/* 4. GUARANTEE / TRUST */}
              <section className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 flex gap-4 items-start">
                <Lock className="w-6 h-6 text-accent shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white uppercase text-sm mb-1">Risque Zéro</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Si nous ne pouvons pas vous fournir de billets, votre 50 $ est remboursé intégralement et immédiatement. Aucune question posée.
                  </p>
                </div>
              </section>
              
              <div className="pt-8 text-center text-[10px] text-zinc-600 font-mono">
                STRADDLE INC. © 2024
              </div>
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
