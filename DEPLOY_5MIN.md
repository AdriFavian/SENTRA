# ⚡ SUPER QUICK DEPLOYMENT - 5 MENIT

## ✅ Step 1: Login Vercel (DONE!)

Anda sudah login ✓

---

## 🚀 Step 2: Deploy via Dashboard (MUDAH!)

**Cara paling mudah - Pakai Vercel Dashboard:**

### 2.1 Push Code ke GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2.2 Import ke Vercel

1. Buka: **https://vercel.com/new**
2. Click: **"Import Git Repository"**
3. Pilih repository: **SENTRA**
4. Click: **"Import"**
5. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detect)
   - Root Directory: **./
   **
   - Build Command: **npm run build** (default)
   - Output Directory: **.next** (default)
6. Click: **"Deploy"**

**Tunggu 2-3 menit... DONE! ✨**

---

## 🗄️ Step 3: Buat Database

1. Dashboard → Your Project → **Storage** tab
2. Click: **"Create Database"**
3. Pilih: **"Postgres"**
4. Database name: **sentra-db**
5. Region: **Singapore (sin1)**
6. Click: **"Create"**

**Otomatis akan add `POSTGRES_URL` ke environment variables!**

---

## ⚙️ Step 4: Add Environment Variables

Dashboard → Your Project → **Settings** → **Environment Variables**

Click **"Add"** untuk setiap variable:

### Required (WAJIB):

```env
TELEGRAM_BOT_TOKEN=paste_your_token_here
TELEGRAM_BOT_USERNAME=your_bot_username
FONNTE_TOKEN=paste_your_token_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=paste_your_key_here
```

### Optional (untuk backend nanti):

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:4001
NEXT_PUBLIC_FLASK_URL=http://localhost:5000
NGROK_URL=http://localhost:3000
```

**Tips:** Pilih environment: **Production, Preview, Development** (all 3)

---

## 🔄 Step 5: Redeploy

Setelah add env vars:

Dashboard → **Deployments** tab → Click "..." → **"Redeploy"**

---

## 💾 Step 6: Setup Database Tables

### 6.1 Get Database URL

Dashboard → Storage → Your Database → **".env.local" tab** → Copy connection string

### 6.2 Update Local .env.local

Paste ke file `.env.local`:

```env
DATABASE_URL=postgres://default:xxx@xxx.postgres.vercel-storage.com/verceldb
```

### 6.3 Run Migration

```bash
node scripts/migrate-to-postgres.js
```

---

## 🎉 DONE! Test Your App

Buka URL Vercel Anda (ada di dashboard):

```
https://sentra-xxx.vercel.app
```

**Yang harus keliatan:**
- ✅ Dashboard loaded
- ✅ No build errors
- ⚠️ Socket.IO belum connect (normal, backend belum running)

---

## 💻 Step 7: Start Backend (Local)

### 7.1 Double-click:

```
start-production.bat
```

### 7.2 Get ngrok URLs

Buka: **http://localhost:4040**

Copy 2 URLs:
- Flask: `https://xxxx.ngrok-free.app`
- Socket: `https://yyyy.ngrok-free.app`

### 7.3 Update Vercel Env Vars

Dashboard → Settings → Environment Variables

**Update:**
- `NEXT_PUBLIC_SOCKET_URL` = ngrok socket URL
- `NEXT_PUBLIC_FLASK_URL` = ngrok flask URL
- `NGROK_URL` = ngrok flask URL

### 7.4 Redeploy

Dashboard → Deployments → "..." → "Redeploy"

---

## ✅ FINAL CHECK

Buka app Anda: `https://sentra-xxx.vercel.app`

**Test:**
1. Dashboard loads ✓
2. Socket.IO connected (check console) ✓
3. Add test CCTV ✓
4. View on map ✓

---

## 🎊 SELESAI!

**Total waktu: 5-10 menit**

Frontend live di: `https://sentra-xxx.vercel.app`
Backend running di laptop Anda

**Lebih mudah kan? 😊**

---

## 📝 Catatan Harian

**Setiap kali mau pakai:**

1. Start: `start-production.bat`
2. Check ngrok: http://localhost:4040
3. Jika URL berubah → Update Vercel env vars → Redeploy

**Tips:** Upgrade ngrok Pro ($8/mo) untuk static URL yang tidak berubah!

---

## 🆘 Masalah?

**Build Failed:**
→ Check Vercel logs di dashboard

**Database Error:**
→ Verify DATABASE_URL correct

**Can't connect to backend:**
→ Check ngrok running & URLs updated

**Lihat DEPLOY_NOW.md untuk panduan detail!**
