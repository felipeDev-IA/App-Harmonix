
import { createClient } from '@supabase/supabase-js';
import { UserStats } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase credentials missing in .env.local');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const signUp = async (email: string, password: string, name: string) => {
  // Garantia total de limpeza e formato
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: { name: cleanName },
      emailRedirectTo: window.location.origin
    }
  });
  
  if (error) console.error('Erro no SignUp:', error.message);
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const cleanEmail = email.trim().toLowerCase();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password
  });
  
  if (error) console.error('Erro no SignIn:', error.message);
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const saveUserStats = async (stats: UserStats) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const updateData: any = {
    id: user.id,
    name: (stats.name || user.user_metadata?.name || 'Músico').trim(),
    xp: stats.xp,
    level: stats.level,
    streak: stats.streak,
    history: stats.history,
    updated_at: new Date().toISOString()
  };

  try {
    const { error } = await supabase
      .from('profiles')
      .upsert(updateData, { onConflict: 'id' });

    if (error) {
      console.error('Erro no saveUserStats:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exceção ao salvar:', err);
    return false;
  }
};

export const loadUserStats = async (): Promise<UserStats | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('name, xp, level, streak, history')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Erro ao carregar perfil:', error.message);
      return null;
    }

    if (!data) {
      return {
        name: user.user_metadata?.name || 'Músico',
        xp: 0,
        level: 1,
        streak: 0,
        history: []
      };
    }

    return data as UserStats;
  } catch (err) {
    return null;
  }
};
