import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export interface SupabaseErrorHandlerOptions {
  showErrorToast?: boolean;
  fallbackValue?: any;
  operation?: string;
}

export const withSupabaseErrorHandling = async <T>(
  operation: () => Promise<T>,
  options: SupabaseErrorHandlerOptions = {}
): Promise<T | null> => {
  const { showErrorToast = true, fallbackValue = null, operation: operationName = 'operation' } = options;
  
  try {
    if (!supabase) {
      const errorMessage = 'Supabase client is not initialized';
      if (showErrorToast) {
        toast.error(errorMessage);
      }
      console.error(errorMessage);
      return fallbackValue;
    }
    
    return await operation();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : `${operationName} failed`;
    
    if (showErrorToast) {
      toast.error(errorMessage);
    }
    
    console.error(`Error in ${operationName}:`, error);
    return fallbackValue;
  }
};

export const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized');
  }
  return supabase;
};

// Specific helper for Supabase queries
export const safeSupabaseQuery = async <T>(
  queryBuilder: any,
  errorMessage = 'Database query failed'
): Promise<{ data: T | null; error: string | null }> => {
  try {
    if (!supabase) {
      return { data: null, error: 'Supabase client is not initialized' };
    }
    
    const { data, error } = await queryBuilder;
    
    if (error) {
      console.error(errorMessage, error);
      return { data: null, error: error.message || errorMessage };
    }
    
    return { data, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : errorMessage;
    console.error(errorMessage, error);
    return { data: null, error: message };
  }
};