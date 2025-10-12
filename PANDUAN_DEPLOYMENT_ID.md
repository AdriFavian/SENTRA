# 🎯 SENTRA - Panduan Deployment Hybrid (Bahasa Indonesia)

## 📌 Ringkasan Singkat

**Anda sudah deploy SENTRA dengan arsitektur:**
- ✅ **Frontend (Website):** Vercel Cloud → https://sentra-navy.vercel.app
- 🔄 **Backend (AI + Realtime):** Laptop Anda
- 🌉 **Koneksi:** ngrok (tunneling)

**Kenapa Hybrid?**
- Frontend selalu online di internet (Vercel)
- Backend berat (AI YOLOv8) jalan di laptop Anda
- Hemat biaya, tidak perlu sewa server cloud mahal

---

## 🚀 Cara Pakai Sehari-hari

### 1️⃣ Nyalakan Backend (Pagi/Saat Mau Pakai)

**Cara Mudah - Jalankan 1 file:**
```powershell
.\start-all-backend.bat
```

Script ini akan otomatis:
- ✅ Start ngrok (bikin tunnel ke laptop)
- ✅ Start Socket.IO (real-time alerts)
- ✅ Start Telegram Bot (kirim notifikasi)
- ✅ Start Flask AI (deteksi kecelakaan pakai YOLO)

**Tunggu sampai muncul ngrok URLs:**
```
Flask:  https://xxxx-xxx-xxx.ngrok-free.app
Socket: https://yyyy-yyy-yyy.ngrok-free.app
```

### 2️⃣ Update Vercel Biar Nyambung ke Laptop

**Cara Otomatis (RECOMMENDED):**
```powershell
node update-vercel-env.js
```

Script ini akan otomatis:
- Ambil ngrok URLs
- Update environment variables di Vercel
- Siap deploy ulang

**Cara Manual (jika script error):**
1. Buka: https://vercel.com/dashboard
2. Pilih project `sentra`
3. Settings → Environment Variables
4. Update 4 variabel ini dengan ngrok URLs:
   - `FLASK_AI_URL` → https://xxxx.ngrok-free.app
   - `NEXT_PUBLIC_FLASK_URL` → https://xxxx.ngrok-free.app  
   - `NEXT_PUBLIC_SOCKET_URL` → https://yyyy.ngrok-free.app
   - `NGROK_URL` → https://xxxx.ngrok-free.app

### 3️⃣ Deploy Ulang Vercel

```powershell
vercel --prod
```

Tunggu 1-2 menit sampai deployment selesai.

### 4️⃣ Buka Website & Pakai!

Buka di browser: **https://sentra-navy.vercel.app**

✅ **SENTRA siap dipakai!**

---

## 🛑 Cara Matikan (Pulang/Selesai Pakai)

1. Tekan `Ctrl+C` di semua terminal yang terbuka
2. Close semua terminal windows
3. Selesai!

**Note:** Frontend di Vercel tetap online, tapi backend (AI detection) tidak jalan sampai Anda nyalakan lagi.

---

## 🔧 Troubleshooting Cepat

### Masalah: "Socket.IO tidak konek"

**Cek:**
```powershell
# Cek apakah Socket.IO jalan
curl http://localhost:4001
```

**Solusi:**
```powershell
# Restart Socket.IO
node helpers/socket/socket.js

# Update Vercel
node update-vercel-env.js
vercel --prod
```

### Masalah: "AI Detection tidak jalan"

**Cek:**
```powershell
# Cek apakah Flask jalan
curl http://localhost:5000
```

**Solusi:**
```powershell
# Restart Flask
python app.py

# Update Vercel
node update-vercel-env.js
vercel --prod
```

### Masalah: "Notifikasi Telegram tidak masuk"

**Solusi:**
1. Pastikan Telegram Bot jalan:
   ```powershell
   node telegram-bot.js
   ```

2. Setup contact dulu di:
   https://sentra-navy.vercel.app/cctvs/settings

3. Dapatkan Chat ID:
   ```powershell
   node scripts/get-telegram-chatid.js
   ```

### Masalah: "ngrok URL berubah terus"

**Kenapa?**  
ngrok gratis kasih URL random setiap restart.

**Solusi Gratis:**  
Update manual setiap restart:
```powershell
node update-vercel-env.js
vercel --prod
```

**Solusi Berbayar (RECOMMENDED untuk produksi):**  
Upgrade ngrok ke paid plan ($8/bulan):
- URL tetap selamanya
- Tidak perlu update Vercel lagi
- Lebih stabil

Link: https://dashboard.ngrok.com/billing/plan

---

## 📊 Cek Status Semua Services

```powershell
.\health-check.bat
```

Akan tampil status:
- ✅ ngrok: RUNNING
- ✅ Socket.IO: RUNNING
- ✅ Flask: RUNNING
- ✅ Node.js: INSTALLED
- ✅ Python: INSTALLED
- ✅ Vercel CLI: INSTALLED

---

## 🎓 Penjelasan Sederhana

### Apa itu ngrok?
ngrok = jembatan dari laptop Anda ke internet

**Tanpa ngrok:**
```
User di Internet ❌ Laptop Anda (localhost)
(Tidak bisa akses)
```

**Dengan ngrok:**
```
User di Internet → ngrok URL → Laptop Anda ✅
(Bisa akses!)
```

### Alur Kerja SENTRA

```
1. User buka website
   ↓
   https://sentra-navy.vercel.app (Vercel Cloud)
   
2. Frontend connect ke backend
   ↓
   ngrok URL (https://xxxx.ngrok-free.app)
   ↓
   Laptop Anda (Flask + Socket.IO)
   
3. CCTV streaming → AI YOLO deteksi kecelakaan
   ↓
   Simpan ke database
   ↓
   Kirim alert:
   - Socket.IO → Frontend (popup alert)
   - Telegram Bot → Pesan Telegram
   - WhatsApp API → Pesan WhatsApp
```

### Files Penting

```
SENTRA/
├─ start-all-backend.bat     👈 Jalankan ini untuk start semua
├─ health-check.bat          👈 Cek status services
├─ update-vercel-env.js      👈 Update Vercel otomatis
├─ ngrok.yml                 👈 Konfigurasi ngrok
│
├─ helpers/
│  └─ socket/socket.js       👈 Real-time alerts
│
├─ app.py                    👈 AI Detection (YOLO)
├─ telegram-bot.js           👈 Telegram notifications
│
└─ app/                      👈 Frontend Next.js
```

---

## 💡 Tips & Trik

### Tip 1: Auto-start Windows Boot (Optional)

Kalau mau backend otomatis jalan waktu laptop nyala:

1. Install PM2:
   ```powershell
   npm install -g pm2
   ```

2. Start services dengan PM2:
   ```powershell
   pm2 start helpers/socket/socket.js --name sentra-socket
   pm2 start telegram-bot.js --name sentra-telegram
   pm2 start app.py --name sentra-flask --interpreter python
   ```

3. Set auto-start:
   ```powershell
   pm2 save
   pm2 startup
   ```

Sekarang backend auto-start setiap laptop nyala!

### Tip 2: Monitor Logs

Lihat apa yang terjadi di backend:

```powershell
# PM2 logs (kalau pakai PM2)
pm2 logs

# Manual logs
# Lihat terminal windows yang running services
```

### Tip 3: Backup Data

```powershell
# Backup database dari Prisma Console
# https://console.prisma.io

# Backup code ke Git
git add .
git commit -m "Update deployment"
git push
```

---

## 🎯 Checklist Harian

### ☀️ Pagi (Start Work)
- [ ] Jalankan `.\start-all-backend.bat`
- [ ] Tunggu ngrok URLs muncul
- [ ] Jalankan `node update-vercel-env.js`
- [ ] Redeploy: `vercel --prod`
- [ ] Test: https://sentra-navy.vercel.app
- [ ] Cek alerts bekerja

### 🌙 Malam (End Work)
- [ ] Ctrl+C di semua terminal
- [ ] Close terminals
- [ ] (Optional) Biarkan jalan kalau butuh 24/7

---

## 📞 Link Penting

- **Website:** https://sentra-navy.vercel.app
- **Vercel Dashboard:** https://vercel.com/dashboard
- **ngrok Dashboard:** https://dashboard.ngrok.com
- **Database:** https://console.prisma.io
- **ngrok Web (lokal):** http://localhost:4040

---

## 🆘 Butuh Bantuan?

### Quick Fix 80% Masalah:
```powershell
node update-vercel-env.js
vercel --prod
```

### Restart Semua:
```powershell
# Stop semua (Ctrl+C di tiap terminal)
# Lalu:
.\start-all-backend.bat
node update-vercel-env.js
vercel --prod
```

### Lihat Dokumentasi Lengkap:
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Panduan detail
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Solusi masalah
- **[ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)** - Penjelasan arsitektur
- **[VERCEL_ENV_CHECKLIST.md](VERCEL_ENV_CHECKLIST.md)** - Checklist environment

---

## 🎉 Selamat!

SENTRA Anda sudah deploy dengan arsitektur hybrid!

**Keuntungan:**
- ✅ Hemat biaya (hampir gratis)
- ✅ Performance bagus
- ✅ AI processing di laptop (pakai GPU lokal)
- ✅ Frontend selalu online
- ✅ Easy maintenance

**Next Level (Future):**
- Deploy backend ke cloud (Railway, Render)
- Upgrade ngrok ke paid ($8/bulan untuk URL tetap)
- Scale ke enterprise production

---

**Happy Monitoring! 🚨📹🤖**

*Dibuat dengan ❤️ untuk SENTRA Project*
