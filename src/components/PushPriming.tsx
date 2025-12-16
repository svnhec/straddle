'use client';

import { useEffect, useState } from 'react';
import { Bell, BellRing, TrendingUp, AlertTriangle } from 'lucide-react';
import { initOneSignalWeb, sendTestNotification } from '@/lib/push/onesignal';

type PermissionState = 'default' | 'granted' | 'denied';

export function PushPriming() {
  const [perm, setPerm] = useState<PermissionState>('default');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setPerm(Notification.permission as PermissionState);
    }
    // Initialize OneSignal (web) if configured
    initOneSignalWeb();
  }, []);

  const requestPermission = async () => {
    if (typeof Notification === 'undefined') return;
    setLoading(true);
    try {
      const res = await Notification.requestPermission();
      setPerm(res as PermissionState);
      if (res === 'granted') {
        await sendTestNotification();
      }
    } catch (err) {
      console.warn('Notification permission failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 border-t border-zinc-800">
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-2xl md:text-3xl font-black uppercase"
          style={{ fontFamily: 'var(--font-archivo), sans-serif' }}
        >
          Activité du Marché
        </h2>
        <span
          className="text-xs text-zinc-500 uppercase tracking-wider"
          style={{ fontFamily: 'var(--font-space-mono), monospace' }}
        >
          Ouvrir l’app 20x/jour, 10s chacune.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-zinc-800 bg-surface p-4 flex flex-col gap-3" style={{ borderRadius: 0 }}>
          <div className="flex items-center gap-2 text-accent">
            <BellRing className="w-5 h-5" />
            <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-space-mono), monospace' }}>
              Money Alert
            </span>
          </div>
          <p className="text-sm text-zinc-400" style={{ fontFamily: 'var(--font-space-mono), monospace' }}>
            “Votre portefeuille est en hausse de +45$ après le but de Suzuki.”
          </p>
        </div>

        <div className="border border-zinc-800 bg-surface p-4 flex flex-col gap-3" style={{ borderRadius: 0 }}>
          <div className="flex items-center gap-2 text-accent">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-space-mono), monospace' }}>
              Opportunité
            </span>
          </div>
          <p className="text-sm text-zinc-400" style={{ fontFamily: 'var(--font-space-mono), monospace' }}>
            “Sièges Rouges -15%. Bon point d’entrée ?”
          </p>
        </div>

        <div className="border border-zinc-800 bg-surface p-4 flex flex-col gap-3" style={{ borderRadius: 0 }}>
          <div className="flex items-center gap-2 text-danger">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-space-mono), monospace' }}>
              Urgence
            </span>
          </div>
          <p className="text-sm text-zinc-400" style={{ fontFamily: 'var(--font-space-mono), monospace' }}>
            “24h pour réclamer ton siège. Auto-Claim ON ✓”
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="text-sm text-zinc-400" style={{ fontFamily: 'var(--font-space-mono), monospace' }}>
          Active l’opt-in après la première action (achat ou suivi d’équipe). Jamais pendant l’onboarding.
        </div>
        <button
          onClick={requestPermission}
          disabled={perm === 'granted' || loading}
          className={`px-4 py-2 text-sm font-bold uppercase border transition-all ${
            perm === 'granted'
              ? 'border-accent text-accent cursor-default'
              : 'border-accent text-accent hover:bg-accent hover:text-black'
          }`}
          style={{ borderRadius: 0, fontFamily: 'var(--font-space-mono), monospace', letterSpacing: '0.1em' }}
        >
          {perm === 'granted' ? 'Alertes activées' : loading ? 'Activation...' : 'Activer les alertes'}
        </button>
      </div>
    </section>
  );
}

