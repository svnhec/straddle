'use client';

import { useState } from 'react';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { TabBar, TabId } from './TabBar';
import { InventoryGrid } from './InventoryGrid';
import { LiveMarketList } from './LiveMarketList';
import { MarketFeed } from './MarketFeed';
import { PortfolioList } from './PortfolioList';
import { SellFlow } from './SellFlow';
import { TicketDelivery } from './TicketDelivery';
import { ClaimFlow } from './ClaimFlow';
import { PushPriming } from './PushPriming';
import { Settings, User, Bell, LogOut, ChevronRight, Wallet, Shield } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function AppShell() {
  const [activeTab, setActiveTab] = useState<TabId>('home');

  return (
    <div className="min-h-screen bg-background text-white pb-32 font-sans selection:bg-accent/30">
      <LayoutGroup>
        <AnimatePresence mode="wait">
        <motion.main
          key={activeTab}
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="min-h-screen pt-[calc(env(safe-area-inset-top)+20px)]"
        >
          {activeTab === 'home' && (
            <div className="space-y-6">
              <header className="px-5 flex justify-between items-center">
                <div>
                   <h1 className="text-2xl font-black tracking-tighter" style={{ fontFamily: 'var(--font-archivo)' }}>STRADDLE</h1>
                   <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Lundi 30 Décembre</p>
                </div>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-accent border border-white/5 active:scale-95 transition-transform shadow-lg"
                >
                  <User className="w-5 h-5" />
                </button>
              </header>

              <MarketFeed />

              {/* All-In Pass Promo (Journey 2) */}
              <div className="px-5">
                 <div className="bg-gradient-to-r from-accent/20 to-blue-500/20 border border-accent/20 rounded-3xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/30 blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                       <div className="text-xs font-black text-accent uppercase tracking-wider mb-1">🏆 ALL-IN PASS</div>
                       <h3 className="text-xl font-black text-white mb-2 uppercase leading-none">Every Round · Game 1</h3>
                       <div className="flex items-end gap-3 mb-3">
                          <div>
                             <div className="text-[10px] text-zinc-400 uppercase">Premium Total</div>
                             <div className="text-2xl font-black text-white">{formatCurrency(142, 0)}</div>
                          </div>
                          <div className="text-xs text-accent font-bold mb-1">Save $2,500+</div>
                       </div>
                       <button className="w-full py-3 bg-white text-black font-black uppercase text-xs rounded-xl shadow-lg active:scale-95 transition-transform">
                          Lock In Now
                       </button>
                    </div>
                 </div>
              </div>

              <div className="px-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-zinc-400 font-mono uppercase tracking-wider">Live Market</h2>
                  <button onClick={() => setActiveTab('options')} className="text-xs text-accent font-bold uppercase tracking-wide hover:text-accent-hover transition-colors">Voir tout</button>
                </div>
                <LiveMarketList />
              </div>
              
              <div className="px-5">
                <PushPriming />
              </div>
            </div>
          )}

          {activeTab === 'options' && (
            <div className="">
              <header className="px-5 mb-6">
                <h1 className="text-3xl font-black tracking-tighter mb-1" style={{ fontFamily: 'var(--font-archivo)' }}>MARCHÉ</h1>
                <p className="text-zinc-400 text-sm font-medium">Réservations disponibles pour 2026</p>
              </header>
              <div className="px-5">
                <InventoryGrid />
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-8">
              <PortfolioList />
              <div className="px-5">
                <h3 className="text-xs font-bold uppercase text-zinc-500 mb-4 font-mono tracking-wider">Gestion Rapide</h3>
                <SellFlow />
              </div>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="space-y-8">
              <header className="px-5">
                <h1 className="text-3xl font-black tracking-tighter mb-1" style={{ fontFamily: 'var(--font-archivo)' }}>BILLETS</h1>
                <p className="text-zinc-400 text-sm font-medium">Vos accès confirmés</p>
              </header>
              <TicketDelivery />
              <ClaimFlow />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="px-5">
              <header className="mb-8">
                <h1 className="text-3xl font-black tracking-tighter mb-1" style={{ fontFamily: 'var(--font-archivo)' }}>RÉGLAGES</h1>
                <p className="text-zinc-400 text-sm font-medium">Préférences & Compte</p>
              </header>
              
              {/* Profile Card */}
              <div className="bg-surface border border-white/5 rounded-3xl p-5 mb-6 flex items-center gap-4">
                 <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-2xl">👤</div>
                 <div>
                    <h3 className="font-bold text-white text-lg">Suvin Sardar</h3>
                    <p className="text-zinc-500 text-sm">suvin@example.com</p>
                 </div>
              </div>

              {/* Balance Card */}
              <div className="bg-zinc-900 border border-white/5 rounded-3xl p-5 mb-8">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Solde Disponible</span>
                    <Wallet className="w-4 h-4 text-zinc-500" />
                 </div>
                 <div className="text-3xl font-black text-white mb-4 font-mono">{formatCurrency(234.00)}</div>
                 <button className="w-full py-3 border border-white/10 rounded-xl text-xs font-bold uppercase hover:bg-white/5 transition-colors">
                    Retirer vers la banque
                 </button>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 ml-2">App Settings</h3>
                
                <div className="group flex items-center justify-between p-4 bg-surface/50 border border-white/5 rounded-2xl active:bg-surface/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center border border-white/5">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-white">Payment Methods</h3>
                      <p className="text-xs text-zinc-500">Apple Pay, Visa ••4242</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600" />
                </div>

                <div className="group flex items-center justify-between p-4 bg-surface/50 border border-white/5 rounded-2xl active:bg-surface/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center border border-white/5">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-white">Notifications</h3>
                      <p className="text-xs text-zinc-500">Price Alerts: ON</p>
                    </div>
                  </div>
                   <ChevronRight className="w-4 h-4 text-zinc-600" />
                </div>

                <div className="group flex items-center justify-between p-4 bg-surface/50 border border-white/5 rounded-2xl active:bg-surface/80 transition-colors mt-8 hover:bg-danger/10 cursor-pointer">
                   <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center">
                      <LogOut className="w-5 h-5 text-danger" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-danger">Déconnexion</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.main>
        </AnimatePresence>
      </LayoutGroup>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
