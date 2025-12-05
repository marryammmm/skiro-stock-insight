# 🚀 QUICK START - DEPLOY SKIRO

## ✅ Yang Sudah Dikerjakan:

1. ✅ **Supabase Integration**
   - Installed `@supabase/supabase-js`
   - Created `src/lib/supabase.ts` (Supabase client config)
   - Updated `AuthContext.tsx` (authentication with Supabase)

2. ✅ **Environment Variables**
   - Created `.env` with your Supabase credentials
   - Created `.env.example` for template
   - Updated `.gitignore` to protect secrets

3. ✅ **Database Schema**
   - Created `database-schema.sql` (SQL script for Supabase)
   - Includes `users` table with RLS policies

4. ✅ **Vercel Configuration**
   - Created `vercel.json` for deployment settings

5. ✅ **Documentation**
   - Created `DEPLOYMENT-GUIDE.md` (complete step-by-step guide)

---

## 🎯 NEXT STEPS (Yang Harus Kamu Lakukan):

### 1️⃣ Setup Database di Supabase (5 menit)
```bash
1. Login ke: https://ksfmtvnmgxyufysmtadt.supabase.co
2. Klik "SQL Editor" → "New Query"
3. Copy-paste isi file: database-schema.sql
4. Klik "Run"
```

### 2️⃣ Push Code ke GitHub (3 menit)
```bash
cd "d:\Semester 7\CAPSTONE\Sistem\Skirov2\skiro-stock-insight"
git init
git add .
git commit -m "Add Supabase integration"
git remote add origin https://github.com/YOUR_USERNAME/skiro-stock-insight.git
git push -u origin main
```

### 3️⃣ Deploy ke Vercel (5 menit)
```bash
1. Login ke: https://vercel.com
2. Klik "Add New..." → "Project"
3. Import repository: skiro-stock-insight
4. Add Environment Variables:
   - VITE_SUPABASE_URL = https://ksfmtvnmgxyufysmtadt.supabase.co
   - VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
5. Klik "Deploy"
```

### 4️⃣ Test Aplikasi (2 menit)
```bash
1. Buka link production dari Vercel
2. Coba Sign Up dengan email baru
3. Cek di Supabase → Table Editor → users (harus ada user baru)
4. Coba Login dengan kredensial yang sama
```

---

## 📁 File-File Penting:

| File | Fungsi |
|------|--------|
| `DEPLOYMENT-GUIDE.md` | **📖 Baca ini untuk panduan lengkap!** |
| `database-schema.sql` | SQL script untuk setup database |
| `.env` | Environment variables (JANGAN di-commit!) |
| `vercel.json` | Konfigurasi deployment Vercel |
| `src/lib/supabase.ts` | Supabase client configuration |
| `src/contexts/AuthContext.tsx` | Authentication logic (updated) |

---

## 🔑 Kredensial Supabase Kamu:

```
Project URL: https://ksfmtvnmgxyufysmtadt.supabase.co
API Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzZm10dm5tZ3h5dWZ5c210YWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MTM4NDAsImV4cCI6MjA4MDQ4OTg0MH0.TeRNSg9pTuytizJ-PTJjEahrjglgjUmA-y3Rk0OGpVE
```

⚠️ **PENTING**: Credentials ini sudah tersimpan di `.env` (lokal) dan nanti akan kamu masukkan manual di Vercel Dashboard.

---

## 💡 Tips:

- **Jangan commit file `.env`** ke GitHub! (sudah di-protect di .gitignore)
- **Test lokal dulu** sebelum deploy: `npm run dev`
- **Cek Vercel Logs** jika ada error setelah deploy
- **Monitor users** di Supabase Table Editor

---

## 📞 Butuh Help?

Baca **DEPLOYMENT-GUIDE.md** untuk troubleshooting dan detail lengkap!

---

**Status Integrasi**: ✅ READY TO DEPLOY!
