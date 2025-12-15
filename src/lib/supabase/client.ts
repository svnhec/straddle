import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function joinWaitlist(email: string, productId: string, productName?: string) {
  const { data, error } = await supabase
    .from('waitlist')
    .insert([{ email, product_id: productId, product_name: productName }])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return { success: true, message: 'Vous êtes déjà inscrit!', alreadyRegistered: true };
    }
    console.error('Waitlist signup error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data, message: 'Inscription réussie!' };
}

export async function subscribeNewsletter(email: string) {
  const { data, error } = await supabase
    .from('newsletter')
    .insert([{ email }])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return { success: true, message: 'Vous êtes déjà inscrit!', alreadyRegistered: true };
    }
    console.error('Newsletter signup error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data, message: 'Inscription réussie!' };
}

