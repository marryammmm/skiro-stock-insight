import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/* -----------------------------------------------------
   Load environment variables (Vite)
----------------------------------------------------- */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/* -----------------------------------------------------
   Validate env variables early to avoid silent failures
----------------------------------------------------- */
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase environment variables missing.");
  console.error("VITE_SUPABASE_URL:", supabaseUrl);
  console.error("VITE_SUPABASE_ANON_KEY:", supabaseAnonKey ? "exists" : "missing");
  throw new Error("❌ Supabase is not configured. Check Vercel environment variables.");
}

console.log("🔍 Supabase environment loaded correctly.");

/* -----------------------------------------------------
   Dynamic storageKey (fix for login stuck on multiple devices)
   - Prevents session conflict when Preview Deployments exist
   - Prevents device storing wrong cached session
----------------------------------------------------- */
const storageKey = `sb-${location.host}-auth`;

console.log("🔑 Using storageKey:", storageKey);

/* -----------------------------------------------------
   Create Supabase Client (no global cache)
----------------------------------------------------- */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey, // <-- FIXED
  },
});

/* -----------------------------------------------------
   Types
----------------------------------------------------- */
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
