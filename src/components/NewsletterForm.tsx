'use client';

import { subscribeNewsletter } from '@/lib/supabase/client';

export function NewsletterForm() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    
    const result = await subscribeNewsletter(emailInput.value);
    
    if (result.success) {
      alert('✓ Inscription réussie!');
      form.reset();
    } else {
      alert('Erreur lors de l\'inscription. Réessayez.');
    }
  };

  return (
    <form 
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      onSubmit={handleSubmit}
    >
      <input
        type="email"
        name="email"
        placeholder="VOTRE EMAIL"
        required
        className="flex-1 px-4 py-3 bg-zinc-900 border-2 border-zinc-700 text-white text-sm uppercase tracking-wider focus:border-blue-500 focus:outline-none"
        style={{ borderRadius: 0, fontFamily: 'var(--font-space-mono), monospace' }}
      />
      <button
        type="submit"
        className="px-6 py-3 font-black text-sm tracking-wider transition-all duration-200 uppercase border-2 bg-blue-500 hover:bg-blue-400 text-white border-transparent hover:border-blue-500 hover:translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[-2px_2px_0px_#3b82f6]"
        style={{ borderRadius: 0, fontFamily: 'var(--font-space-mono), monospace', letterSpacing: '0.1em' }}
      >
        S&apos;INSCRIRE
      </button>
    </form>
  );
}

