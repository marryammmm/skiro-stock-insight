import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Load env variables (Vite)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate env immediately
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase environment variables missing.");
  console.error("VITE_SUPABASE_URL:", supabaseUrl);
  console.error("VITE_SUPABASE_ANON_KEY:", supabaseAnonKey ? "exists" : "missing");

  // This prevents silent fallback bugs
  throw new Error("Supabase is not configured. Check Vercel environment variables.");
}

console.log("🔍 Supabase initialized with valid environment variables.");

// Create client (no global cache, simpler & safer)
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "sb-skiro-auth",
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
