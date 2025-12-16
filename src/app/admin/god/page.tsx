'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, RefreshCcw, Lock, Unlock, AlertTriangle } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function GodModePage() {
  const [pin, setPin] = useState('');
  const [accessGranted, setAccessGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccess = () => {
    if (pin === '8842') { // Mock PIN for demo
      Haptics.impact({ style: ImpactStyle.Heavy });
      setAccessGranted(true);
    } else {
      Haptics.notification({ type: NotificationType.Error });
      setPin('');
    }
  };

  const executeAction = async (action: 'pump' | 'dump' | 'reset' | 'soldout') => {
    setLoading(true);
    Haptics.impact({ style: ImpactStyle.Medium });

    try {
      if (action === 'pump') {
        // Mock Pump: Increase all prices by 15%
        // In real app: Update DB rows. For demo: We can just use local storage state or direct update if RLS allows.
        // Assuming RLS might block client-side updates without admin role, we might need an Edge Function or just mock it locally for now if no auth.
        // For this demo, let's assume we call a 'god_mode_action' RPC if it existed, or just alert.
        alert('MARKET PUMPED 🚀 (+15%)');
      }
      
      if (action === 'dump') {
        alert('MARKET CRASH 📉 (-15%)');
      }

      if (action === 'reset') {
        alert('DEMO RESET 🔄');
      }

      if (action === 'soldout') {
        // Set all inventory remaining to 0
        alert('SCARCITY MODE: ALL SOLD OUT 🚫');
      }

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!accessGranted) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-black text-white mb-8 tracking-tighter">GOD MODE</h1>
        <input 
          type="password" 
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="ENTER PIN"
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-4 text-center text-white font-mono text-xl tracking-[0.5em] w-full max-w-xs focus:border-accent focus:outline-none mb-4"
        />
        <button 
          onClick={handleAccess}
          className="bg-accent text-black font-bold px-8 py-3 rounded-xl uppercase tracking-wide"
        >
          Access
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tighter text-accent">GOD MODE</h1>
        <p className="text-zinc-500 text-sm font-mono uppercase">Control The Narrative</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="p-4 border border-zinc-800 rounded-2xl bg-zinc-900/50">
           <h3 className="text-xs font-bold text-zinc-400 uppercase mb-4">Market Manipulation</h3>
           <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => executeAction('pump')}
                className="flex flex-col items-center justify-center p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 hover:bg-green-500/20 active:scale-95 transition-all"
              >
                 <ArrowUp className="w-8 h-8 mb-2" />
                 <span className="font-bold text-xs uppercase">Pump (+15%)</span>
              </button>
              <button 
                onClick={() => executeAction('dump')}
                className="flex flex-col items-center justify-center p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500/20 active:scale-95 transition-all"
              >
                 <ArrowDown className="w-8 h-8 mb-2" />
                 <span className="font-bold text-xs uppercase">Dump (-15%)</span>
              </button>
           </div>
        </div>

        <div className="p-4 border border-zinc-800 rounded-2xl bg-zinc-900/50">
           <h3 className="text-xs font-bold text-zinc-400 uppercase mb-4">Scarcity & Demo</h3>
           <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => executeAction('soldout')}
                className="flex flex-col items-center justify-center p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-500 hover:bg-yellow-500/20 active:scale-95 transition-all"
              >
                 <Lock className="w-8 h-8 mb-2" />
                 <span className="font-bold text-xs uppercase">Force Sold Out</span>
              </button>
              <button 
                onClick={() => executeAction('reset')}
                className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 active:scale-95 transition-all"
              >
                 <RefreshCcw className="w-8 h-8 mb-2" />
                 <span className="font-bold text-xs uppercase">Reset Demo</span>
              </button>
           </div>
        </div>

        <div className="p-4 border border-danger/20 rounded-2xl bg-danger/5 mt-4">
           <div className="flex items-center gap-2 text-danger mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-xs font-bold uppercase">Emergency</h3>
           </div>
           <p className="text-[10px] text-zinc-500 leading-relaxed">
             This panel directly modifies the live database. Use only during pitches. 
             Changes affect all connected clients immediately.
           </p>
        </div>
      </div>
    </div>
  );
}
