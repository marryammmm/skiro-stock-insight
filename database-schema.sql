-- ========================================
-- SKIRO DATABASE SCHEMA - SUPABASE
-- ========================================
-- Panduan Setup Database Supabase untuk Aplikasi Skiro
-- 
-- CARA PAKAI:
-- 1. Login ke https://ksfmtvnmgxyufysmtadt.supabase.co
-- 2. Buka menu "SQL Editor" di sidebar
-- 3. Copy-paste script SQL di bawah ini
-- 4. Klik "Run" untuk execute
-- ========================================

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- ========================================
-- TABLE: users
-- ========================================
-- Menyimpan data pengguna aplikasi Skiro
-- ========================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  business_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own data
CREATE POLICY "Users can view own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can insert their own data
CREATE POLICY "Users can insert own data"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ========================================
-- FUNCTION: Update timestamp otomatis
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk auto-update timestamp
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- INDEXES untuk performa query
-- ========================================

CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);
CREATE INDEX IF NOT EXISTS users_created_at_idx ON public.users(created_at);

-- ========================================
-- INSERT DEMO DATA (OPTIONAL)
-- ========================================
-- Uncomment jika ingin menambahkan data demo
-- ========================================

-- INSERT INTO public.users (id, email, name, business_name)
-- VALUES (
--   gen_random_uuid(),
--   'demo@skiro.dev',
--   'Demo User',
--   'Demo Fashion Store'
-- );

-- ========================================
-- VERIFIKASI SETUP
-- ========================================
-- Jalankan query ini untuk verifikasi:
-- SELECT * FROM public.users;
-- ========================================
