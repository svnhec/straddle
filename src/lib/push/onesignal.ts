'use client';

/**
 * OneSignal scaffolding (web + Capacitor):
 * - Add NEXT_PUBLIC_ONESIGNAL_APP_ID to .env.local
 * - For mobile (Capacitor), install OneSignal SDK/plugin later
 * - For web, you need OneSignal service worker; this file is a placeholder for future integration.
 */

export const oneSignalAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || '';

export async function initOneSignalWeb() {
  if (typeof window === 'undefined') return;
  if (!oneSignalAppId) return;

  // Placeholder: actual OneSignal init should be done once SDK is added.
  // Example (when SDK is available):
  // await OneSignal.init({ appId: oneSignalAppId });
  console.info('OneSignal init skipped (scaffold only). Add SDK to enable.');
}

export async function sendTestNotification() {
  if (typeof window === 'undefined') return;
  new Notification('Straddle • Test', {
    body: 'Ceci est un test de notification.',
  });
}

