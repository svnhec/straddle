'use client';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { useEffect } from 'react';

// Use environment variables or hardcode for demo purposes if needed
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || 'phc_MOCK_KEY_FOR_DEMO_REPLACE_ME';
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check if window is defined (client-side) and key is present
    if (typeof window !== 'undefined' && POSTHOG_KEY && POSTHOG_KEY !== 'phc_MOCK_KEY_FOR_DEMO_REPLACE_ME') {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        capture_pageview: false, // We handle this manually in nextjs app router usually, or auto
        capture_pageleave: true,
      });
    } else {
        console.log("PostHog Analytics initialized in MOCK mode (No key provided)");
    }
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
