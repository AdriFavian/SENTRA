# 🚀 Quick Start - Production Deployment

## Untuk Menjalankan Backend di Laptop (Daily Use)

### 1️⃣ Start semua backend services:

**Windows:**
```powershell
# Cara mudah - jalankan batch file
.\start-backend.bat

# Atau manual di terminal terpisah:
# Terminal 1:
npm run backend

# Terminal 2:
python app.py
```

### 2️⃣ Start ngrok:

```powershell
ngrok start --all --config ngrok.yml
```

### 3️⃣ Copy ngrok URLs

Setelah ngrok running, catat 2 URLs:
- Flask Backend: `https://xxxx.ngrok-free.app` (port 5000)
- Socket.IO: `https://yyyy.ngrok-free.app` (port 4001)

### 4️⃣ Update Vercel Environment Variables

**Jika ngrok URL berubah (free tier):**

```powershell
# Install Vercel CLI jika belum
npm i -g vercel

# Update env vars
vercel env rm NEXT_PUBLIC_SOCKET_URL production
vercel env add NEXT_PUBLIC_SOCKET_URL production
# Masukkan: https://yyyy.ngrok-free.app

vercel env rm NEXT_PUBLIC_FLASK_URL production
vercel env add NEXT_PUBLIC_FLASK_URL production
# Masukkan: https://xxxx.ngrok-free.app

vercel env rm NGROK_URL production
vercel env add NGROK_URL production
# Masukkan: https://xxxx.ngrok-free.app

# Redeploy
npm run deploy
```

### 5️⃣ Akses aplikasi

Buka: `https://your-app.vercel.app`

---

## ✅ Checklist Sebelum Mulai

- [ ] Database production sudah setup (Vercel Postgres/Supabase)
- [ ] ngrok authtoken sudah dikonfigurasi
- [ ] Model YOLO (`test5.pt`) ada di folder project
- [ ] Python dependencies terinstall (`pip install -r requirements.txt`)
- [ ] Node dependencies terinstall (`npm install`)
- [ ] Environment variables sudah diset di Vercel

---

## 📱 Monitoring

- **Ngrok Dashboard:** http://localhost:4040
- **Vercel Logs:** https://vercel.com/dashboard (pilih project → Deployments → View Logs)
- **Backend Logs:** Lihat terminal tempat services running

---

## 🛑 Stop Services

```powershell
# Ctrl+C di setiap terminal
# Atau close windows yang dibuka oleh start-backend.bat
```

---

## 📖 Full Documentation

Lihat `DEPLOYMENT.md` untuk dokumentasi lengkap.
