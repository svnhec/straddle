import type { Metadata, Viewport } from 'next';
import { Archivo_Black, Space_Mono } from 'next/font/google';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/800.css';
import './globals.css';
import { PHProvider } from '@/lib/providers/PostHogProvider';

const archivoBlack = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Straddle | Réservez vos billets de séries au prix coûtant',
  description: 'Réservez vos billets de séries éliminatoires des Canadiens de Montréal. Payez le prix officiel uniquement si le CH fait les séries.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0A0B0F',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`dark ${archivoBlack.variable} ${spaceMono.variable}`}>
      <PHProvider>
        <body 
          className="bg-background text-white antialiased font-sans"
        >
          {children}
        </body>
      </PHProvider>
    </html>
  );
}
