import { supabase } from './supabase';

export const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized');
  }
  return supabase;
};

export const withSupabaseClient = async <T>(
  operation: (client: typeof supabase) => Promise<T>
): Promise<T> => {
  const client = getSupabaseClient();
  return await operation(client);
};