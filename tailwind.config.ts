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
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
        },
        background: '#09090b',
        foreground: '#fafafa',
      },
      fontFamily: {
        sans: ['var(--font-space-mono)', 'Courier New', 'monospace'],
        archivo: ['var(--font-archivo)', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
