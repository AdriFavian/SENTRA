# 🚀 LANGKAH DEMI LANGKAH - Deploy SENTRA ke Vercel

## ✅ Step 1: Login ke Vercel (SELESAI ✓)

Anda sudah login! Lanjut ke step berikutnya.

---

## 📦 Step 2: Deploy Project

Jalankan perintah ini:

```bash
vercel
```

Anda akan ditanya beberapa pertanyaan:

### Pertanyaan & Jawaban:

**Q: "Set up and deploy ~\SENTRA?"**
→ Jawab: **Y** (Yes)

**Q: "Which scope do you want to deploy to?"**
→ Pilih: **Your username/account** (biasanya default, tekan Enter)

**Q: "Link to existing project?"**
→ Jawab: **N** (No - karena ini project baru)

**Q: "What's your project's name?"**
→ Ketik: **sentra** (atau nama lain yang Anda mau)

**Q: "In which directory is your code located?"**
→ Jawab: **./** (tekan Enter untuk default)

**Q: "Want to override the settings?"**
→ Jawab: **N** (No - biarkan auto-detect)

---

## 🎯 Step 3: Tunggu Deployment Selesai

Vercel akan:
- ✅ Upload project
- ✅ Install dependencies
- ✅ Build Next.js
- ✅ Deploy ke production

**Ini akan memakan waktu 2-5 menit.**

Anda akan mendapat URL seperti:
```
https://sentra-xxx.vercel.app
```

---

## 🗄️ Step 4: Buat Database (PostgreSQL)

### Via Vercel Dashboard:

1. Buka: https://vercel.com/dashboard
2. Click project Anda (**sentra**)
3. Tab **Storage** → Click **Create Database**
4. Pilih: **Postgres**
5. Database name: **sentra-db** (atau nama lain)
6. Region: **Singapore (sin1)** - paling dekat
7. Click **Create**

### Atau Via CLI:

```bash
vercel postgres create sentra-db
```

---

## ⚙️ Step 5: Setup Environment Variables

### 5.1 Get Database URL

Setelah database dibuat:
```bash
vercel env pull .env.production
```

Ini akan download environment variables termasuk `POSTGRES_URL`.

### 5.2 Add Manual Environment Variables

Buka Vercel Dashboard → Your Project → Settings → Environment Variables

Tambahkan variable berikut (untuk **Production** environment):

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | (auto dari Postgres) | ✅ Sudah ada |
| `NEXT_PUBLIC_SOCKET_URL` | `http://localhost:4001` | Update nanti dengan ngrok |
| `NEXT_PUBLIC_FLASK_URL` | `http://localhost:5000` | Update nanti dengan ngrok |
| `NGROK_URL` | `http://localhost:3000` | Update nanti dengan ngrok |
| `TELEGRAM_BOT_TOKEN` | Your bot token | Dari @BotFather |
| `TELEGRAM_BOT_USERNAME` | Your bot username | Tanpa @ |
| `FONNTE_TOKEN` | Your fonnte token | Dari fonnte.com |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Your API key | Dari Google Cloud |
| `NODE_ENV` | `production` | - |
| `NEXT_PUBLIC_APP_URL` | `https://sentra-xxx.vercel.app` | URL Vercel Anda |

---

## 🔄 Step 6: Redeploy dengan Environment Variables

Setelah add semua env vars:

```bash
vercel --prod
```

---

## 💾 Step 7: Setup Database Tables

### 7.1 Update .env.local dengan Vercel Database URL

Copy `DATABASE_URL` dari Vercel dan paste ke `.env.local`:

```env
DATABASE_URL=postgres://default:xxx@xxx.postgres.vercel-storage.com/verceldb
```

### 7.2 Run Migration

```bash
node scripts/migrate-to-postgres.js
```

Ini akan create semua tables yang diperlukan.

---

## 🎉 Step 8: Test Frontend

Buka URL Vercel Anda: `https://sentra-xxx.vercel.app`

**Yang harus terlihat:**
- ✅ Dashboard loaded
- ✅ Sidebar navigation
- ⚠️ Socket.IO belum connected (normal, karena backend belum running)
- ⚠️ CCTV list kosong (normal, karena belum ada data)

---

## 💻 Step 9: Setup Backend di Laptop

### 9.1 Update .env.local

Edit file `.env.local`:

```env
# Database - Ganti dengan Vercel Postgres URL
DATABASE_URL=postgres://default:xxx@xxx.postgres.vercel-storage.com/verceldb

# Application - Ganti dengan URL Vercel Anda
NEXT_PUBLIC_APP_URL=https://sentra-xxx.vercel.app
BACKEND_API_URL=https://sentra-xxx.vercel.app/api

# Backend (sementara localhost dulu)
NEXT_PUBLIC_SOCKET_URL=http://localhost:4001
FLASK_AI_URL=http://localhost:5000
NEXT_PUBLIC_FLASK_URL=http://localhost:5000
NGROK_URL=http://localhost:3000

# ... env vars lainnya tetap sama
```

### 9.2 Start Backend Services

Double-click file: **`start-production.bat`**

Atau via terminal:
```bash
start-production.bat
```

**3 windows akan terbuka:**
1. **ngrok** - Tunneling service
2. **Node Backend** - Socket.IO + Telegram Bot
3. **Flask AI** - YOLOv8 detection

---

## 🌐 Step 10: Get ngrok URLs

1. Buka browser: http://localhost:4040
2. Anda akan lihat 2 tunnels:

```
Tunnel 1 (Flask):
https://xxxx-xx-xx-xx-xx.ngrok-free.app → http://localhost:5000

Tunnel 2 (Socket.IO):
https://yyyy-yy-yy-yy-yy.ngrok-free.app → http://localhost:4001
```

**COPY kedua URL ini!** Anda akan butuh untuk step berikutnya.

---

## 🔧 Step 11: Update Vercel Environment Variables dengan ngrok URLs

### Option 1: Manual via Dashboard

1. Buka: https://vercel.com/dashboard
2. Your Project → Settings → Environment Variables
3. Update variables berikut (edit existing):
   - `NEXT_PUBLIC_SOCKET_URL` = `https://yyyy-yy-yy-yy-yy.ngrok-free.app`
   - `NEXT_PUBLIC_FLASK_URL` = `https://xxxx-xx-xx-xx-xx.ngrok-free.app`
   - `NGROK_URL` = `https://xxxx-xx-xx-xx-xx.ngrok-free.app`

### Option 2: Automated via Script (RECOMMENDED)

```bash
npm run update-vercel-env
```

**Note:** Script ini akan otomatis update env vars di Vercel.

---

## 🚀 Step 12: Redeploy Vercel

Agar perubahan env vars aktif:

```bash
vercel --prod
```

**Atau Quick Redeploy:**
- Buka Vercel Dashboard
- Deployments tab
- Click "..." pada deployment terakhir
- Click "Redeploy"

---

## ✅ Step 13: Final Verification

### 13.1 Check Frontend

Buka: `https://sentra-xxx.vercel.app`

**Checklist:**
- [ ] Dashboard loaded
- [ ] Socket.IO connected (check browser console - F12)
- [ ] No errors di console

### 13.2 Test Add CCTV

1. Pergi ke "CCTV Management"
2. Click "Add New CCTV"
3. Masukkan data test:
   - IP Address: `rtsp://example.com/stream`
   - Latitude: `-6.200000`
   - Longitude: `106.816666`
   - City: `Jakarta`
4. Submit
5. CCTV harus muncul di list

### 13.3 Test Real-time Connection

Buka browser console (F12) → Console tab

Anda harus lihat:
```
Connected to Socket.IO server
```

### 13.4 Check Backend Logs

Di terminal yang running `npm run socket`, Anda harus lihat:
```
👤 Client connected: <socket-id>
📊 Total connected clients: 1
```

---

## 🎊 SELESAI!

**Deployment berhasil jika:**
- ✅ Frontend accessible dari internet
- ✅ Socket.IO connected
- ✅ Bisa add CCTV
- ✅ Database working
- ✅ Backend services running

---

## 📝 Update .env.local untuk Development

Untuk development lokal, buat file `.env.local` dengan:

```env
# Database (Vercel Postgres)
DATABASE_URL=postgres://default:xxx@xxx.postgres.vercel-storage.com/verceldb

# Backend (Local)
BACKEND_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:4001
FLASK_AI_URL=http://localhost:5000
NEXT_PUBLIC_FLASK_URL=http://localhost:5000
NGROK_URL=http://localhost:3000

# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Credentials (sama seperti production)
TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_BOT_USERNAME=your_username
FONNTE_TOKEN=your_token
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
```

---

## 🔄 Daily Workflow (Setelah Deploy)

Setiap kali mau pakai:

1. **Start backend**: Double-click `start-production.bat`
2. **Get ngrok URLs**: Buka http://localhost:4040
3. **Update Vercel** (jika ngrok URL berubah):
   - Manual: Update di dashboard
   - Auto: `npm run update-vercel-env`
4. **Redeploy**: `vercel --prod` (jika update env vars)

---

## 🆘 Troubleshooting

**Error: Build failed**
→ Check Vercel deployment logs

**Error: Database connection**
→ Verify DATABASE_URL correct

**Error: Socket.IO not connecting**
→ Check ngrok URL & backend running

**Error: 404 on Flask endpoint**
→ Check Flask running & ngrok tunnel active

**Lihat FAQ.md untuk troubleshooting lengkap!**

---

## 📞 Next Steps

1. Test semua fitur
2. Add real CCTVs
3. Setup Telegram contacts
4. Monitor deployment
5. Check analytics di Vercel

**Selamat! SENTRA Anda sudah live! 🎉**
