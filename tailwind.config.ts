import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#10B981', // Emerald 500
          hover: '#059669', // Emerald 600
        },
        danger: {
          DEFAULT: '#EF4444', // Red 500 (softer than neon)
        },
        background: '#0A0B0F', // Deep Charcoal
        surface: '#18181B', // Zinc 900
        foreground: '#fafafa',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Primary font for body
        archivo: ['var(--font-archivo)', 'sans-serif'], // For Headings
        mono: ['var(--font-space-mono)', 'Courier New', 'monospace'], // For data/code
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
};
export default config;
