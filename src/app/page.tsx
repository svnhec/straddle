'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { OnboardingFlow } from '@/components/OnboardingFlow';

// Using dynamic imports or disabling SSR for AppShell might be needed if it relies heavily on window/browser APIs immediately
// But usually 'use client' is enough.

export default function Page() {
  const [onboarded, setOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage to skip onboarding
    // For demo purposes, we can reset this by clearing storage
    const done = localStorage.getItem('straddle_onboarded');
    if (done) setOnboarded(true);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-black" />; // Loading state
  }

  if (!onboarded) {
    return <OnboardingFlow onComplete={() => {
      localStorage.setItem('straddle_onboarded', 'true');
      setOnboarded(true);
    }} />;
  }

  return <AppShell />;
}
