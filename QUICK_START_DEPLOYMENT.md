# 🚀 Quick Start - Deployment Hybrid SENTRA

## Arsitektur
- **Frontend:** Vercel (https://sentra-navy.vercel.app) ✅ 
- **Backend:** Laptop Anda (Flask, Socket.IO, Telegram Bot)
- **Koneksi:** ngrok tunnels

---

## ⚡ Cara Menjalankan (Setiap Hari)

### 1️⃣ Start Semua Backend Services

```powershell
.\start-all-backend.bat
```

Script ini akan:
- ✅ Start ngrok tunnels (Flask port 5000, Socket port 4001)
- ✅ Start Socket.IO server
- ✅ Start Telegram Bot
- ✅ Start Flask AI backend
- ✅ Tampilkan ngrok URLs

### 2️⃣ Update Vercel Environment Variables

**Cara Otomatis (RECOMMENDED):**
```powershell
node update-vercel-env.js
```

**Cara Manual:**
1. Salin ngrok URLs dari terminal
2. Buka: https://vercel.com/dashboard
3. Pilih project "sentra"
4. Settings → Environment Variables
5. Update variabel berikut:
   - `FLASK_AI_URL` → `https://xxxx.ngrok-free.app`
   - `NEXT_PUBLIC_FLASK_URL` → `https://xxxx.ngrok-free.app`
   - `NEXT_PUBLIC_SOCKET_URL` → `https://yyyy.ngrok-free.app`
   - `NGROK_URL` → `https://xxxx.ngrok-free.app`

### 3️⃣ Redeploy Vercel

```powershell
vercel --prod
```

Atau trigger dari dashboard: https://vercel.com/dashboard → Deployments → Redeploy

### 4️⃣ Akses Website

Buka: **https://sentra-navy.vercel.app**

✅ SENTRA siap digunakan!

---

## 🛑 Cara Mematikan

1. Tekan `Ctrl+C` di semua terminal windows
2. Close semua terminal
3. Frontend Vercel tetap online (tapi backend tidak berfungsi)

---

## 📝 Troubleshooting

### Problem: "Cannot connect to Socket.IO"
**Fix:**
```powershell
# Restart Socket.IO
node helpers/socket/socket.js

# Update Vercel env
node update-vercel-env.js
vercel --prod
```

### Problem: "AI Detection not working"
**Fix:**
```powershell
# Restart Flask
python app.py

# Update Vercel env
node update-vercel-env.js
vercel --prod
```

### Problem: ngrok URL berubah
**Fix:**
```powershell
# Auto-update Vercel
node update-vercel-env.js
vercel --prod
```

---

## 🔗 Links

- **Website:** https://sentra-navy.vercel.app
- **Vercel Dashboard:** https://vercel.com/dashboard
- **ngrok Dashboard:** http://localhost:4040 (saat ngrok running)
- **Database Console:** https://console.prisma.io

---

## 📊 Monitoring Services

### Check ngrok URLs:
```powershell
.\get-ngrok-urls.bat
```

### Check Status:
```powershell
# ngrok
curl http://localhost:4040/api/tunnels

# Socket.IO
curl http://localhost:4001

# Flask
curl http://localhost:5000
```

---

## 💡 Tips

### Auto-restart saat crash (Optional)

Install PM2:
```powershell
npm install -g pm2

# Start dengan PM2
pm2 start helpers/socket/socket.js --name sentra-socket
pm2 start telegram-bot.js --name sentra-telegram
pm2 start app.py --name sentra-flask --interpreter python

# Save
pm2 save
pm2 startup
```

### ngrok Static URL (Recommended)

Upgrade ke ngrok paid ($8/month):
- URL tetap (tidak berubah)
- Tidak perlu update Vercel setiap restart
- https://dashboard.ngrok.com/billing/plan

---

## 📞 Quick Commands

```powershell
# 1. Start semua
.\start-all-backend.bat

# 2. Update Vercel
node update-vercel-env.js

# 3. Redeploy
vercel --prod

# 4. Check ngrok URLs
.\get-ngrok-urls.bat
```

---

**🎉 Selamat! SENTRA Anda sudah deploy hybrid!**

Untuk dokumentasi lengkap, lihat: `DEPLOYMENT_GUIDE.md`
