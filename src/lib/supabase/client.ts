import { createClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

export const supabaseUrl = 'https://imeweqrvijtxaubchhon.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZXdlcXJ2aWp0eGF1YmNoaG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk4MzQwNTEsImV4cCI6MjA0NTQxMDA1MX0.oZnvg1FWXG_hRM9pCRq8FZLER6QqEUqXM7oqcReg6uM';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'sb-imeweqrvijtxaubchhon-auth-token'
  },
  global: {
    headers: { 'apikey': supabaseAnonKey }
  },
  db: { schema: 'public' },
  realtime: {
    params: { eventsPerSecond: 2 }
  }
});

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  onRetry?: (attempt: number, error: any) => void;
}

export class SupabaseError extends Error {
  constructor(
    message: string,
    public readonly originalError?: any,
    public readonly context?: any
  ) {
    super(message);
    this.name = 'SupabaseError';
  }
}

export const fetchWithRetry = async <T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  options: RetryOptions = {}
): Promise<T> => {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    onRetry
  } = options;

  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { data, error } = await queryFn();
      
      if (error) {
        throw new SupabaseError('Supabase query failed', error, {
          attempt,
          maxRetries
        });
      }
      
      if (!data) {
        throw new SupabaseError('No data returned from Supabase', null, {
          attempt,
          maxRetries
        });
      }
      
      return data;
    } catch (err) {
      lastError = err;
      
      if (attempt === maxRetries) {
        break;
      }

      const delay = Math.min(
        initialDelay * Math.pow(2, attempt - 1),
        maxDelay
      );

      if (onRetry) {
        onRetry(attempt, err);
      }

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new SupabaseError(
    `Failed after ${maxRetries} attempts`,
    lastError,
    { maxRetries }
  );
};

export const handleSupabaseError = (error: any): string => {
  if (error instanceof SupabaseError) {
    const { originalError, context } = error;
    
    if (originalError?.code === 'PGRST202') {
      return 'Database function not found. Please try again later.';
    }
    
    if (originalError?.code === '23505') {
      return 'This record already exists.';
    }
    
    if (originalError?.code === '42P01') {
      return 'Required database table is missing. Please contact support.';
    }
    
    return error.message;
  }
  
  if (error instanceof Error) {
    if (error.message.includes('Failed to fetch')) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

export default supabase;