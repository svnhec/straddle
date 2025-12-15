import { Shield, Clock, CreditCard, ChevronRight, Ticket } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { NewsletterForm } from '@/components/NewsletterForm';
import { InventoryGrid } from '@/components/InventoryGrid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const VALUE_PROPS = [
  { icon: Shield, title: 'Garanti ou Remboursé', desc: 'Si le CH ne fait pas les séries, option annulée.' },
  { icon: Clock, title: 'Réservez Maintenant', desc: 'Payez le coût du billet uniquement si le match est confirmé.' },
  { icon: CreditCard, title: 'Paiement Sécurisé', desc: 'Stripe. Apple Pay. Google Pay.' },
];

export default async function HomePage() {
  const { data: inventoryData, error } = await supabase
    .from('inventory')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching inventory:', error);
  }

  const initialInventory = (inventoryData || []).map((item) => ({
    id: item.id,
    section: item.title,
    desc: item.description,
    price: item.price,
    faceValue: item.face_value,
    status: item.status as 'available' | 'sold_out',
    tags: item.tags || [],
    remaining: item.remaining || 0,
    stripeLink: item.stripe_link,
  }));

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-b-2 border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-black text-lg tracking-tight uppercase" style={{ fontFamily: 'var(--font-archivo), sans-serif' }}>
              STRADDLE
            </span>
          </div>
          <a href="#options" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-all flex items-center gap-1 px-3 py-1.5 border-2 border-blue-500/30 hover:border-blue-500 hover:translate-x-[2px] hover:-translate-y-[1px] uppercase tracking-wider" style={{ borderRadius: 0, fontFamily: 'var(--font-space-mono), monospace' }}>
            Réserver <ChevronRight className="w-3 h-3" />
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/15 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center py-20">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border-2 border-blue-500 px-4 py-2 mb-8" style={{ borderRadius: 0 }}>
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-blue-400 text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-space-mono), monospace' }}>
              DROP #1 • LIVE NOW
            </span>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-20 scale-50" />
            <h1 className="relative text-4xl md:text-6xl font-black mb-6 leading-tight uppercase" style={{ fontFamily: 'var(--font-archivo), sans-serif' }}>
              SÉCURISEZ VOS SIÈGES<br />
              POUR LES <span className="text-gradient">SÉRIES 2026.</span>
            </h1>
          </div>

          <p className="text-lg md:text-xl text-zinc-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Oui, croyez le ou non, c&apos;est possible maintenant.
            <span className="text-white font-semibold"> Quantités ultra-limitées.</span>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-zinc-900 border-2 border-white px-6 py-4 text-center" style={{ borderRadius: 0, fontFamily: 'var(--font-space-mono), monospace' }}>
              <div className="text-2xl font-black">{initialInventory.length}</div>
              <div className="text-xs text-zinc-400 uppercase tracking-wider">Inventaire</div>
            </div>
            <div className="bg-zinc-900 border-2 border-blue-500/50 px-6 py-4 text-center" style={{ borderRadius: 0, fontFamily: 'var(--font-space-mono), monospace' }}>
              <div className="text-2xl font-black text-blue-400">{initialInventory.reduce((sum, p) => sum + (p.remaining || 0), 0)}</div>
              <div className="text-blue-400/80 text-xs uppercase tracking-wider">Places</div>
            </div>
            <div className="bg-red-500/10 border-2 border-red-500 px-6 py-4 text-center" style={{ borderRadius: 0, fontFamily: 'var(--font-space-mono), monospace' }}>
              <div className="text-2xl font-black text-red-500">24H</div>
              <div className="text-red-400 text-xs uppercase tracking-wider">⏰ Deadline</div>
            </div>
          </div>

          <a href="#options" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-black px-8 py-4 transition-all border-2 border-transparent hover:border-blue-600 hover:translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[-2px_2px_0px_#3b82f6] uppercase tracking-wider" style={{ borderRadius: 0, fontFamily: 'var(--font-space-mono), monospace' }}>
            <Ticket className="w-5 h-5" />
            VOIR LES OPTIONS
          </a>
        </div>
      </section>

      {/* OPTIONS GRID */}
      <section id="options" className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-black text-center mb-4 uppercase" style={{ fontFamily: 'var(--font-archivo), sans-serif' }}>
          Choisissez votre zone
        </h2>
        <p className="text-zinc-400 text-center mb-12 max-w-xl mx-auto text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-space-mono), monospace' }}>
          Réservez aujourd&apos;hui. Payez le face value si les Canadiens font les séries.
        </p>

        {/* Realtime Inventory Grid */}
        <InventoryGrid initialInventory={initialInventory} />
        
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 py-16 border-t-2 border-zinc-800">
        <h2 className="text-2xl md:text-3xl font-black text-center mb-12 uppercase" style={{ fontFamily: 'var(--font-archivo), sans-serif' }}>
          Comment ça marche?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { num: '1', title: "RÉSERVEZ AUJOURD'HUI", desc: "Payez un dépôt pour garantir votre accès au prix officiel." },
            { num: '2', title: 'LE CH FAIT LES SÉRIES', desc: "Si les Canadiens se qualifient, on vous notifie. Sinon, l'option expire." },
            { num: '3', title: 'RÉCLAMEZ VOTRE BILLET', desc: "Si le CH se qualifie, vous payez le prix officiel du billet (sans marge revendeur) et vous recevez vos places 24h avant le match." },
          ].map((step) => (
            <div key={step.num} className="text-center p-6 border-2 border-zinc-800 hover:border-blue-500 transition-colors" style={{ borderRadius: 0 }}>
              <div className="w-12 h-12 bg-blue-500/10 border-2 border-blue-500 flex items-center justify-center mx-auto mb-4" style={{ borderRadius: 0 }}>
                <span className="font-black text-blue-400 text-xl" style={{ fontFamily: 'var(--font-archivo), sans-serif' }}>{step.num}</span>
              </div>
              <h3 className="font-black text-sm mb-3 uppercase tracking-wider" style={{ fontFamily: 'var(--font-archivo), sans-serif' }}>{step.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed" style={{ fontFamily: 'var(--font-space-mono), monospace' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST SIGNALS */}
      <section className="max-w-7xl mx-auto px-4 py-12 border-t border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {VALUE_PROPS.map((prop) => (
            <div key={prop.title} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <prop.icon className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{prop.title}</h3>
                <p className="text-sm text-zinc-500">{prop.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STICKY MOBILE CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-950/95 backdrop-blur-xl border-t-2 border-zinc-800 md:hidden safe-bottom">
        <a href="#options" className="block w-full bg-blue-500 hover:bg-blue-400 text-white font-black py-4 text-center transition-all border-2 border-transparent hover:border-blue-600 uppercase tracking-wider" style={{ borderRadius: 0, fontFamily: 'var(--font-space-mono), monospace' }}>
          ⚡ VOIR LES OPTIONS
        </a>
      </div>

      {/* NEWSLETTER */}
      <section className="max-w-7xl mx-auto px-4 py-16 border-t-2 border-zinc-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-4 uppercase" style={{ fontFamily: 'var(--font-archivo), sans-serif' }}>
            Ne manquez pas le Drop #2
          </h2>
          <p className="text-zinc-400 mb-8 text-sm uppercase tracking-wider" style={{ fontFamily: 'var(--font-space-mono), monospace' }}>
            Soyez alerté en premier pour les prochaines options
          </p>
          <NewsletterForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 py-12 border-t-2 border-zinc-800 mb-20 md:mb-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <span className="font-black text-sm uppercase" style={{ fontFamily: 'var(--font-archivo), sans-serif' }}>STRADDLE</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-zinc-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-space-mono), monospace' }}>
            <a href="#" className="hover:text-white transition-colors">Conditions</a>
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-xs text-zinc-600 uppercase tracking-wider" style={{ fontFamily: 'var(--font-space-mono), monospace' }}>
            © 2025 Straddle
          </p>
        </div>
      </footer>
    </main>
  );
}

