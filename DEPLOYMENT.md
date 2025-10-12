# 🚀 SENTRA Deployment Guide - Hybrid Setup

## Arsitektur Deployment

- **Frontend (Next.js)**: Deploy di Vercel
- **Backend (Flask + Socket.IO)**: Running di laptop Anda via ngrok
- **Database**: PostgreSQL (Vercel Postgres, Supabase, atau hosting lain)

## 📋 Prerequisites

- [x] Akun Vercel
- [x] Akun ngrok (gratis atau berbayar)
- [x] Python 3.x terinstall di laptop
- [x] Node.js terinstall di laptop
- [x] PostgreSQL database (cloud-based)

---

## 🔧 Step-by-Step Deployment

### 1. Setup Database Production

**Opsi A: Vercel Postgres (Recommended)**
1. Buka project di Vercel Dashboard
2. Go to Storage → Create Database → Postgres
3. Copy connection string
4. Jalankan migration:
```bash
node scripts/migrate-to-postgres.js
```

**Opsi B: Supabase (Free tier available)**
1. Create project di [supabase.com](https://supabase.com)
2. Get connection string dari Settings → Database
3. Update `.env.local` dengan connection string

---

### 2. Setup Ngrok

#### Install ngrok (jika belum):
```powershell
# Download dari https://ngrok.com/download
# Atau via chocolatey:
choco install ngrok
```

#### Setup ngrok authtoken:
```powershell
ngrok config add-authtoken YOUR_NGROK_AUTH_TOKEN
```

#### Edit ngrok.yml:
Ganti `YOUR_NGROK_AUTH_TOKEN` di file `ngrok.yml` dengan authtoken Anda.

#### Start ngrok tunnels:
```powershell
ngrok start --all --config ngrok.yml
```

**Catat URL yang diberikan:**
- Flask: `https://xxxx-xx-xxx-xxx-xxx.ngrok-free.app` (port 5000)
- Socket.IO: `https://yyyy-yy-yyy-yyy-yyy.ngrok-free.app` (port 4001)

---

### 3. Persiapan Frontend untuk Vercel

#### Update `.gitignore`:
Pastikan file-file berikut ada di `.gitignore`:
```
.env*.local
node_modules/
.next/
snapshots/
__pycache__/
*.pt
*.pyc
```

#### Install Vercel CLI (optional):
```powershell
npm i -g vercel
```

---

### 4. Deploy Frontend ke Vercel

#### Metode 1: Via GitHub (Recommended)

1. **Push code ke GitHub:**
```powershell
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

2. **Connect ke Vercel:**
   - Login ke [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import repository GitHub Anda
   - Framework Preset: **Next.js** (auto-detected)

3. **Set Environment Variables di Vercel:**

Go to Settings → Environment Variables, tambahkan:

```
DATABASE_URL=postgresql://...your-postgres-url...
NEXT_PUBLIC_SOCKET_URL=https://yyyy-yy-yyy-yyy-yyy.ngrok-free.app
NEXT_PUBLIC_FLASK_URL=https://xxxx-xx-xxx-xxx-xxx.ngrok-free.app
FLASK_AI_URL=https://xxxx-xx-xxx-xxx-xxx.ngrok-free.app
NGROK_URL=https://xxxx-xx-xxx-xxx-xxx.ngrok-free.app
FONNTE_TOKEN=your_fonnte_token
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

#### Metode 2: Via Vercel CLI

```powershell
# Login
vercel login

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SOCKET_URL
# ... add semua environment variables

# Deploy to production
vercel --prod
```

---

### 5. Jalankan Backend di Laptop

#### Terminal 1: Start Node.js Services
```powershell
# Windows
.\start-backend.bat

# Or manual:
node helpers/socket/socket.js
# Dan di terminal lain:
node telegram-bot.js
```

#### Terminal 2: Start Flask Backend
```powershell
python app.py
```

#### Terminal 3: Start ngrok
```powershell
ngrok start --all --config ngrok.yml
```

---

### 6. Testing Deployment

1. **Buka aplikasi Vercel Anda:**
   ```
   https://your-app.vercel.app
   ```

2. **Test connections:**
   - Cek apakah halaman loading
   - Cek console browser untuk errors
   - Test Socket.IO connection
   - Test CCTV streaming

3. **Monitor ngrok:**
   - Buka dashboard: `http://localhost:4040`
   - Lihat incoming requests

---

## 🔄 Workflow Harian

### Saat ingin menggunakan aplikasi:

1. **Start backend services di laptop:**
```powershell
# Terminal 1
.\start-backend.bat

# Terminal 2  
python app.py

# Terminal 3
ngrok start --all --config ngrok.yml
```

2. **Cek ngrok URLs** (akan berubah setiap restart jika free tier)

3. **Update Vercel env vars** jika ngrok URL berubah:
```powershell
vercel env rm NEXT_PUBLIC_SOCKET_URL production
vercel env add NEXT_PUBLIC_SOCKET_URL production
# masukkan URL ngrok yang baru

vercel env rm NEXT_PUBLIC_FLASK_URL production  
vercel env add NEXT_PUBLIC_FLASK_URL production
# masukkan URL ngrok yang baru

# Redeploy
vercel --prod
```

4. **Akses aplikasi** via URL Vercel

---

## 💡 Tips & Optimasi

### 1. Ngrok Static Domain (Berbayar)
Jika menggunakan ngrok berbayar, Anda bisa dapat static subdomain:
```yaml
# ngrok.yml
tunnels:
  flask:
    proto: http
    addr: 5000
    subdomain: sentra-flask  # Custom subdomain
  socket:
    proto: http
    addr: 4001
    subdomain: sentra-socket
```

### 2. Auto-start Backend on Windows Boot
Buat shortcut `start-backend.bat` di:
```
C:\Users\YourName\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
```

### 3. Keep Laptop Awake
```powershell
# Windows: Prevent sleep when plugged in
powercfg /change standby-timeout-ac 0
```

### 4. Monitor dengan PM2 (Optional)
```powershell
npm install -g pm2
pm2 start helpers/socket/socket.js --name socket
pm2 start telegram-bot.js --name telegram
pm2 save
pm2 startup
```

---

## ⚠️ Catatan Penting

### Ngrok Free Tier Limitations:
- URL berubah setiap restart
- Maximum 40 connections/minute
- Session timeout 8 hours

### Solusi:
- Upgrade ke ngrok Pro ($8/bulan) untuk static URL
- Atau gunakan alternatif: LocalTunnel, Cloudflare Tunnel, Tailscale

### Database:
- **JANGAN** gunakan localhost database
- **HARUS** gunakan cloud database (Vercel Postgres, Supabase, dll)
- Pastikan connection string diupdate di Vercel env vars

### CORS:
Backend Flask sudah dikonfigurasi dengan CORS allow all (`*`), tapi untuk production sebaiknya:
```python
# app.py
CORS(app, origins=['https://your-app.vercel.app'])
```

---

## 🐛 Troubleshooting

### Frontend tidak connect ke backend:
1. Cek ngrok masih running
2. Cek URL ngrok di Vercel env vars
3. Redeploy Vercel setelah update env vars

### Socket.IO timeout:
1. Cek firewall/antivirus
2. Cek ngrok connection limit
3. Monitor di ngrok dashboard (localhost:4040)

### Flask tidak detect accident:
1. Cek model `test5.pt` ada di folder
2. Cek Python dependencies terinstall
3. Cek logs di terminal Flask

---

## 📞 Support

Jika ada masalah:
1. Check logs di terminal backend
2. Check ngrok dashboard: http://localhost:4040
3. Check Vercel deployment logs
4. Check browser console untuk frontend errors

---

## 🎯 Checklist Deployment

- [ ] Database production ready (Vercel Postgres/Supabase)
- [ ] ngrok authtoken configured
- [ ] ngrok tunnels running (Flask + Socket.IO)
- [ ] Environment variables set di Vercel
- [ ] Code pushed to GitHub
- [ ] Vercel project imported
- [ ] Vercel deployment successful
- [ ] Backend services running di laptop
- [ ] Test frontend connection
- [ ] Test CCTV streaming
- [ ] Test accident detection
- [ ] Test notifications (Telegram/WhatsApp)

---

**Selamat! Aplikasi Anda sudah live! 🎉**

URL Production: https://your-app.vercel.app
