import type { Metadata, Viewport } from 'next';
import { Archivo_Black, Space_Mono } from 'next/font/google';
import './globals.css';

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
  description: 'Achetez des options sur les billets de séries éliminatoires des Canadiens de Montréal. Payez le face value uniquement si le CH fait les séries.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`dark ${archivoBlack.variable} ${spaceMono.variable}`}>
      <body 
        className="bg-zinc-950 text-white antialiased"
        style={{ fontFamily: 'var(--font-space-mono), Courier New, monospace' }}
      >
        {children}
      </body>
    </html>
  );
}
