'use client';

import { Home, LineChart, Wallet, Ticket, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export type TabId = 'home' | 'options' | 'portfolio' | 'tickets' | 'settings';

const tabs: { id: TabId; label: string; icon: any }[] = [
  { id: 'home', label: 'Accueil', icon: Home },
  { id: 'options', label: 'Marché', icon: LineChart },
  { id: 'portfolio', label: 'Portefeuille', icon: Wallet },
  { id: 'tickets', label: 'Billets', icon: Ticket },
  { id: 'settings', label: 'Réglages', icon: Settings },
];

export function TabBar({ activeTab, onTabChange }: { activeTab: TabId; onTabChange: (id: TabId) => void }) {
  
  const handleTabPress = async (id: TabId) => {
    if (id !== activeTab) {
      await Haptics.impact({ style: ImpactStyle.Light });
      onTabChange(id);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom)] pt-2">
      <div className="grid grid-cols-5 text-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabPress(tab.id)}
              className="relative flex flex-col items-center justify-center h-14"
            >
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute -top-2 w-8 h-1 bg-accent rounded-full shadow-[0_0_10px_rgba(0,255,148,0.5)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className={`relative p-1.5 transition-colors duration-300 ${isActive ? 'text-accent' : 'text-zinc-500'}`}>
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              <span className={`text-[9px] font-mono uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-accent font-bold' : 'text-zinc-600'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
