'use client';

import { useState } from 'react';
import { ChevronRight, Shield, Check, Star, ArrowRight, Lock, Bell } from 'lucide-react';
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
      <div className="min-h-screen bg-black text-white">
        {/* Navigation / Header */}
        <nav className="p-5 flex justify-between items-center max-w-7xl mx-auto">
           <h1 className="text-xl font-black tracking-tighter" style={{ fontFamily: 'var(--font-archivo)' }}>STRADDLE</h1>
        </nav>

        <main className="max-w-md mx-auto px-5 pb-20 space-y-20 pt-10">
            <>
              {/* 1. HERO SECTION */}
              <section className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 px-3 py-1 text-xs uppercase tracking-wider rounded-full text-accent">
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span style={{ fontFamily: 'var(--font-space-mono)' }}>Places Limitées</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tight" style={{ fontFamily: 'var(--font-archivo)' }}>
                  Séries 2026 :<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">Sécurisez vos billets</span><br />
                  avant la foule.
                </h1>
                
                <p className="text-zinc-400 leading-relaxed font-medium">
                  Ne payez pas les prix fous de la revente. Un dépôt de 50 $ vous garantit un accès prioritaire à notre inventaire exclusif sous le prix du marché.
                </p>

                <button
                  onClick={handleReserveClick}
                  className="w-full py-4 bg-accent text-black font-black uppercase tracking-wider text-lg shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl"
                  style={{ fontFamily: 'var(--font-space-mono)' }}
                >
                  Réserver ma Passe (50 $)
                </button>
                
                <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 font-mono">
                  <Shield className="w-3 h-3 text-accent" />
                  <span>Dépôt 100% remboursable</span>
                </div>
              </section>

              {/* 2. PRODUCT SECTION */}
              <section>
                <div className="bg-surface border border-white/10 rounded-3xl overflow-hidden relative group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-blue-500" />
                  
                  {/* Badge */}
                  <div className="bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider py-2 px-4 text-center border-b border-white/5">
                    Quantité Limitée : 50 places seulement
                  </div>

                  <div className="p-6 md:p-8 space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-black uppercase leading-none mb-2" style={{ fontFamily: 'var(--font-archivo)' }}>
                          Passe Prioritaire
                        </h2>
                        <p className="text-zinc-400 font-mono text-sm">Ronde 1 · Match 1</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-white" style={{ fontFamily: 'var(--font-space-mono)' }}>
                          50,00 $
                        </div>
                        <div className="text-xs text-zinc-500 line-through decoration-danger">95,00 $</div>
                      </div>
                    </div>

                    {/* Bullet Points */}
                    <div className="space-y-3">
                      {[
                        'Accès prioritaire à l\'inventaire (24h avant le public)',
                        'Prix final garanti SOUS le marché (vs StubHub)',
                        'Choix des zones (Rouges, Desjardins, Gris) selon disponibilité',
                        'Dépôt 100% Remboursable si aucun billet n\'est trouvé'
                      ].map((item, i) => (
                        <div key={i} className="flex gap-3 items-start text-sm text-zinc-300">
                          <Check className="w-5 h-5 text-accent shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleReserveClick}
                      className="w-full py-3 bg-white text-black font-black uppercase tracking-wider text-sm rounded-xl hover:bg-zinc-200 transition-colors"
                    >
                      Ajouter au panier
                    </button>
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
