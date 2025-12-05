import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log environment check (remove after debugging)
console.log('🔍 Supabase URL exists:', !!supabaseUrl);
console.log('🔍 Supabase Key exists:', !!supabaseAnonKey);
if (supabaseUrl) {
  console.log('🔍 Supabase URL:', supabaseUrl.substring(0, 30) + '...');
}

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl);
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'exists' : 'missing');
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file or Vercel settings.'
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Database types
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}
