'use client';

import { Star, Users, Sparkles, Ticket, Bell } from 'lucide-react';
import { useState } from 'react';
import { joinWaitlist } from '@/lib/supabase/client';

interface Product {
  id: string;
  section: string;
  desc: string;
  price: number;
  faceValue?: number;
  status: 'available' | 'sold_out';
  tags: string[];
  remaining?: number;
  stripeLink?: string;
}

interface ProductCardProps {
  product: Product;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
  }).format(price);
}

function getTagIcon(tag: string) {
  if (tag.toLowerCase().includes('vip') || tag.toLowerCase().includes('inclusive')) {
    return <Star className="w-3 h-3" />;
  }
  if (tag.toLowerCase().includes('ambiance') || tag.toLowerCase().includes('fan')) {
    return <Users className="w-3 h-3" />;
  }
  return <Sparkles className="w-3 h-3" />;
}

export function ProductCard({ product }: ProductCardProps) {
  const isAvailable = product.status === 'available';
  const remaining = product.remaining ?? 0;
  const isLowStock = remaining <= 3 && isAvailable;

  const [showWaitlistInput, setShowWaitlistInput] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const handleReserve = () => {
    if (!isAvailable) return;
    if (product.stripeLink) {
      window.location.href = product.stripeLink;
    } else {
      alert('Erreur: Lien de paiement non configuré');
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) return;

    const result = await joinWaitlist(waitlistEmail, product.id, product.section);
    
    if (result.success) {
      setWaitlistSubmitted(true);
      setTimeout(() => {
        setShowWaitlistInput(false);
        setWaitlistSubmitted(false);
        setWaitlistEmail('');
      }, 3000);
    } else {
      alert('Erreur lors de l\'inscription. Réessayez.');
    }
  };

  return (
    <div 
      className={`relative bg-zinc-900 border-2 border-white overflow-hidden transition-all duration-200 ${isAvailable ? 'hover:translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[-2px_2px_0px_#fff]' : ''}`}
      style={{ borderRadius: 0 }}
    >
      {/* Header with icon */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <Ticket className={`w-12 h-12 ${isAvailable ? 'text-blue-500' : 'text-zinc-600'}`} />
          {isLowStock && remaining > 0 && (
            <div className="badge-shimmer text-white text-xs font-black px-3 py-1 uppercase tracking-wider border-2 border-blue-600" style={{ borderRadius: 0, fontFamily: 'var(--font-space-mono), monospace' }}>
              ⚠ {remaining} LEFT
            </div>
          )}
          {!isAvailable && (
            <div className="bg-red-600 text-white text-xs font-black px-3 py-1 uppercase tracking-wider border-2 border-red-400" style={{ borderRadius: 0, fontFamily: 'var(--font-space-mono), monospace' }}>
              ✕ SOLD OUT
            </div>
          )}
        </div>

        <h3 className="font-black text-lg text-white mb-2 uppercase tracking-tight" style={{ fontFamily: 'var(--font-archivo), sans-serif' }}>
          {product.section}
        </h3>
        <p className="text-sm text-zinc-400 mb-4 leading-relaxed" style={{ fontFamily: 'var(--font-space-mono), monospace' }}>
          {product.desc}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 text-xs bg-zinc-800 text-zinc-400 px-2 py-1 border border-zinc-700 uppercase tracking-wider" style={{ borderRadius: 0, fontFamily: 'var(--font-space-mono), monospace' }}>
              {getTagIcon(tag)}
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Dashed line separator */}
      <div className="border-t-2 border-dashed border-zinc-700 w-full" />

      {/* Pricing */}
      <div className="p-6 pt-4">
        <div className="flex items-end justify-between mb-4">
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1" style={{ fontFamily: 'var(--font-space-mono), monospace' }}>
              aujourd&apos;hui
            </span>
            <span className="text-3xl font-black text-white" style={{ fontFamily: 'var(--font-archivo), sans-serif' }}>
              {formatPrice(product.price)}
            </span>
          </div>
          {product.faceValue && (
            <div className="text-right">
              <span className="text-xs text-zinc-500 block uppercase tracking-wider" style={{ fontFamily: 'var(--font-space-mono), monospace' }}>
                Le prix en Avril
              </span>
              <span className="text-lg text-zinc-400 font-bold" style={{ fontFamily: 'var(--font-space-mono), monospace' }}>
                {formatPrice(product.faceValue)}
              </span>
            </div>
          )}
        </div>

        {/* CTA Button */}
        {isAvailable ? (
          <button
            onClick={handleReserve}
            className="w-full py-4 font-black text-sm tracking-wider transition-all duration-200 uppercase border-2 bg-blue-500 hover:bg-blue-400 text-white border-transparent hover:border-blue-500 hover:translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[-2px_2px_0px_#3b82f6]"
            style={{ borderRadius: 0, fontFamily: 'var(--font-space-mono), monospace', letterSpacing: '0.1em' }}
          >
            ⚡ RÉSERVER MAINTENANT
          </button>
        ) : (
          <div className="space-y-3">
            {!showWaitlistInput ? (
              <button
                onClick={() => setShowWaitlistInput(true)}
                className="w-full py-4 font-black text-sm tracking-wider transition-all duration-200 uppercase border-2 bg-zinc-900 text-blue-400 border-blue-500 hover:bg-blue-500 hover:text-white hover:translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[-2px_2px_0px_#3b82f6]"
                style={{ borderRadius: 0, fontFamily: 'var(--font-space-mono), monospace', letterSpacing: '0.1em' }}
              >
                <Bell className="inline-block w-4 h-4 mr-2" />
                M&apos;AVERTIR
              </button>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="space-y-2">
                <input
                  type="email"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="VOTRE EMAIL"
                  required
                  className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-700 text-white text-sm uppercase tracking-wider focus:border-blue-500 focus:outline-none"
                  style={{ borderRadius: 0, fontFamily: 'var(--font-space-mono), monospace' }}
                  disabled={waitlistSubmitted}
                />
                {!waitlistSubmitted ? (
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 font-bold text-xs tracking-wider transition-all duration-200 uppercase border-2 bg-blue-500 hover:bg-blue-400 text-white border-transparent"
                      style={{ borderRadius: 0, fontFamily: 'var(--font-space-mono), monospace' }}
                    >
                      ✓ NOTIFIER
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowWaitlistInput(false)}
                      className="px-4 py-2 font-bold text-xs tracking-wider transition-all duration-200 uppercase border-2 bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-600"
                      style={{ borderRadius: 0, fontFamily: 'var(--font-space-mono), monospace' }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="py-3 text-center text-blue-400 text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-space-mono), monospace' }}>
                    ✓ Vous serez notifié!
                  </div>
                )}
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

