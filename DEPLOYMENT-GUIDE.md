# 🚀 PANDUAN DEPLOY SKIRO KE VERCEL

Panduan lengkap untuk deploy aplikasi Skiro ke Vercel dengan database Supabase.

---

## 📋 PREREQUISITES

Sebelum deploy, pastikan kamu sudah punya:
- ✅ Akun GitHub (untuk push code)
- ✅ Akun Vercel (https://vercel.com)
- ✅ Akun Supabase (sudah setup)
- ✅ Project Supabase URL dan API Key

---

## 🗄️ STEP 1: SETUP DATABASE SUPABASE

### 1.1 Login ke Supabase Dashboard
- Buka: https://ksfmtvnmgxyufysmtadt.supabase.co
- Login dengan akun Supabase kamu

### 1.2 Buat Tabel Users
1. Klik menu **"SQL Editor"** di sidebar kiri
2. Klik **"New Query"**
3. Copy-paste semua isi file `database-schema.sql` ke editor
4. Klik **"Run"** atau tekan `Ctrl + Enter`
5. Tunggu sampai muncul notifikasi "Success"

### 1.3 Verifikasi Database
Jalankan query ini untuk cek apakah tabel sudah dibuat:
```sql
SELECT * FROM public.users;
```

Jika tidak ada error, database siap! ✅

---

## 🔑 STEP 2: SETUP ENVIRONMENT VARIABLES

### 2.1 Cek File .env Lokal
File `.env` sudah dibuat dengan kredensial:
```
VITE_SUPABASE_URL=https://ksfmtvnmgxyufysmtadt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **PENTING**: File `.env` TIDAK di-commit ke GitHub (sudah ada di .gitignore)

---

## 📦 STEP 3: PUSH CODE KE GITHUB

### 3.1 Initialize Git (jika belum)
```bash
cd "d:\Semester 7\CAPSTONE\Sistem\Skirov2\skiro-stock-insight"
git init
git add .
git commit -m "Initial commit - Skiro with Supabase integration"
```

### 3.2 Buat Repository di GitHub
1. Buka https://github.com/new
2. Nama repository: `skiro-stock-insight`
3. Set visibility: **Public** atau **Private**
4. **JANGAN** centang "Initialize with README"
5. Klik **"Create repository"**

### 3.3 Push ke GitHub
```bash
git remote add origin https://github.com/USERNAME/skiro-stock-insight.git
git branch -M main
git push -u origin main
```

Ganti `USERNAME` dengan username GitHub kamu.

---

## 🚀 STEP 4: DEPLOY KE VERCEL

### 4.1 Login ke Vercel
1. Buka https://vercel.com
2. Login dengan akun GitHub kamu
3. Klik **"Add New..."** → **"Project"**

### 4.2 Import Repository
1. Pilih repository: `skiro-stock-insight`
2. Klik **"Import"**

### 4.3 Configure Project
- **Framework Preset**: Vite
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (sudah otomatis)
- **Output Directory**: `dist` (sudah otomatis)

### 4.4 Setup Environment Variables
⚠️ **LANGKAH PALING PENTING!**

Di bagian **"Environment Variables"**, tambahkan:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://ksfmtvnmgxyufysmtadt.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzZm10dm5tZ3h5dWZ5c210YWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MTM4NDAsImV4cCI6MjA4MDQ4OTg0MH0.TeRNSg9pTuytizJ-PTJjEahrjglgjUmA-y3Rk0OGpVE` |

**Cara Input:**
1. Ketik nama variable di kolom "Name"
2. Paste value di kolom "Value"
3. Klik **"Add"**
4. Ulangi untuk variable kedua

### 4.5 Deploy!
1. Klik **"Deploy"**
2. Tunggu proses build (biasanya 2-3 menit)
3. Jika sukses, kamu akan lihat 🎉 konfetti dan link production!

---

## ✅ STEP 5: TEST APLIKASI

### 5.1 Buka Aplikasi
Klik link production yang diberikan Vercel, contoh:
```
https://skiro-stock-insight.vercel.app
```

### 5.2 Test Registrasi
1. Klik **"Sign Up"** atau **"Daftar"**
2. Isi form registrasi:
   - Email: `test@example.com`
   - Password: `password123`
   - Name: `Test User`
   - Business Name: `Test Store`
3. Klik **"Sign Up"**

### 5.3 Verifikasi Database
Kembali ke Supabase Dashboard → SQL Editor, jalankan:
```sql
SELECT * FROM public.users;
```

Kamu harus lihat user baru yang baru saja didaftarkan! ✅

### 5.4 Test Login
1. Logout dari aplikasi
2. Login dengan email dan password yang sama
3. Jika berhasil masuk ke dashboard, SUKSES! 🎉

---

## 🔄 UPDATE APLIKASI (FUTURE DEPLOYMENT)

Setiap kali kamu update code:

```bash
git add .
git commit -m "Update: deskripsi perubahan"
git push origin main
```

Vercel akan **otomatis re-deploy** aplikasi kamu! 🚀

---

## 🐛 TROUBLESHOOTING

### ❌ Error: "Missing Supabase environment variables"
**Solusi**: 
- Cek environment variables di Vercel Dashboard
- Pastikan nama variable persis sama: `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`
- Re-deploy dengan klik "Redeploy" di Vercel

### ❌ Error: "relation 'public.users' does not exist"
**Solusi**: 
- Database belum di-setup
- Jalankan ulang SQL script di `database-schema.sql`

### ❌ Build Failed
**Solusi**: 
- Cek error message di Vercel build logs
- Pastikan semua dependencies ter-install dengan benar
- Jalankan `npm run build` di lokal dulu untuk test

### ❌ User tidak bisa login/signup
**Solusi**: 
- Cek browser console untuk error message
- Verifikasi Supabase URL dan API Key benar
- Pastikan Row Level Security policies sudah di-apply

---

## 📊 MONITORING

### Cek Logs di Vercel
1. Buka project di Vercel Dashboard
2. Klik tab **"Logs"**
3. Monitor real-time logs dan errors

### Cek Users di Supabase
1. Buka Supabase Dashboard
2. Klik **"Table Editor"** → `users`
3. Lihat semua registered users

---

## 🎯 CUSTOM DOMAIN (OPTIONAL)

Jika kamu punya domain sendiri:

1. Di Vercel Dashboard, klik tab **"Settings"**
2. Klik **"Domains"**
3. Tambahkan domain kamu
4. Follow instruksi untuk update DNS records
5. Tunggu propagasi (biasanya 24-48 jam)

---

## 📞 SUPPORT

Jika ada masalah:
- Check Vercel Docs: https://vercel.com/docs
- Check Supabase Docs: https://supabase.com/docs
- GitHub Issues: Buat issue di repository

---

## 🎉 SELAMAT!

Aplikasi Skiro kamu sekarang sudah live dan bisa diakses dari mana saja! 🚀

**Production URL**: https://skiro-stock-insight.vercel.app (contoh)
**Database**: Supabase PostgreSQL
**Authentication**: Supabase Auth

---

**Dibuat dengan ❤️ untuk Skiro - Fashion Deadstock Prevention System**
