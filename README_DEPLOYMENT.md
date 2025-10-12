# 🚀 SENTRA - Panduan Deployment Lengkap

## 📚 Dokumentasi

Pilih dokumen sesuai kebutuhan:

### 🎯 Quick Start (Mulai Cepat)
- **[QUICK_START_DEPLOYMENT.md](QUICK_START_DEPLOYMENT.md)** - Cara menjalankan sehari-hari
- **[VERCEL_ENV_CHECKLIST.md](VERCEL_ENV_CHECKLIST.md)** - Checklist environment variables

### 📖 Detailed Guides
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Panduan deployment lengkap
- **[ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)** - Penjelasan arsitektur sistem
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Solusi masalah umum

---

## ⚡ Quick Commands

### Start Backend (Daily Use)
```powershell
# Start semua services
.\start-all-backend.bat

# Update Vercel environment
node update-vercel-env.js

# Redeploy Vercel
vercel --prod
```

### Health Check
```powershell
.\health-check.bat
```

### Get ngrok URLs
```powershell
.\get-ngrok-urls.bat
```

---

## 📊 Architecture Summary

```
Frontend (Vercel)  ←→  Backend (Laptop)
     ↓                      ↓
 Next.js                Flask (AI)
 Always Online          Socket.IO
                        Telegram Bot
     ↓                      ↓
 Database (Cloud)     ngrok Tunnels
```

**Current Setup:**
- ✅ Frontend: https://sentra-navy.vercel.app
- 🔄 Backend: Laptop Anda (via ngrok)
- 🗄️ Database: Prisma Accelerate (PostgreSQL)

---

## 🎯 One-Time Setup

### 1. Install Prerequisites
```powershell
# Install ngrok
winget install ngrok

# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project
vercel link
```

### 2. Setup ngrok
```powershell
# Add authtoken
ngrok config add-authtoken YOUR_TOKEN

# File ngrok.yml sudah tersedia
```

### 3. Setup Vercel Environment Variables
Lihat: **[VERCEL_ENV_CHECKLIST.md](VERCEL_ENV_CHECKLIST.md)**

---

## 🔄 Daily Workflow

### Morning (Start Services)
```powershell
# 1. Start all backend
.\start-all-backend.bat

# 2. Update Vercel dengan ngrok URLs
node update-vercel-env.js

# 3. Redeploy (if URLs changed)
vercel --prod
```

### Evening (Stop Services)
- Press `Ctrl+C` di semua terminal windows
- Close terminals
- Frontend Vercel tetap online

---

## 🆘 Troubleshooting

### Quick Fix (Solves 80% issues)
```powershell
node update-vercel-env.js
vercel --prod
```

### Health Check
```powershell
.\health-check.bat
```

### Detailed Solutions
Lihat: **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)**

---

## 📞 Important Links

- **Frontend:** https://sentra-navy.vercel.app
- **Vercel Dashboard:** https://vercel.com/dashboard
- **ngrok Dashboard:** https://dashboard.ngrok.com
- **Database Console:** https://console.prisma.io
- **ngrok Web Interface:** http://localhost:4040 (saat ngrok running)

---

## 💡 Tips

### ngrok URLs Berubah Terus?
**Masalah:** ngrok free tier memberikan random URLs setiap restart

**Solusi A (Free):** Auto-update dengan script
```powershell
node update-vercel-env.js
vercel --prod
```

**Solusi B (Paid - RECOMMENDED):** Upgrade ngrok ke paid plan
- Cost: $8/month
- Static URLs (tidak pernah berubah)
- Tidak perlu update Vercel lagi
- Link: https://dashboard.ngrok.com/billing/plan

### Auto-restart Services
```powershell
# Install PM2
npm install -g pm2

# Start dengan PM2
pm2 start helpers/socket/socket.js --name sentra-socket
pm2 start telegram-bot.js --name sentra-telegram
pm2 start app.py --name sentra-flask --interpreter python

# Auto-start on boot
pm2 save
pm2 startup
```

---

## 🎓 Understanding the System

### Request Flow
1. User → Vercel Frontend
2. Frontend → ngrok → Laptop Backend
3. Backend → Database
4. Backend → Socket.IO → Frontend
5. Backend → Telegram/WhatsApp

### File Structure
```
📁 SENTRA/
├─ 📄 start-all-backend.bat     ← Start semua services
├─ 📄 health-check.bat          ← Check status services
├─ 📄 get-ngrok-urls.bat        ← Get ngrok URLs
├─ 📄 update-vercel-env.js      ← Update Vercel env vars
├─ 📄 ngrok.yml                 ← ngrok configuration
├─ 📄 .env.local                ← Local environment vars
│
├─ 📁 app/                      ← Next.js frontend
├─ 📁 helpers/                  ← Backend helpers
│  ├─ socket/socket.js          ← Socket.IO server
│  └─ telegram/telegramBot.js   ← Telegram bot
├─ 📄 app.py                    ← Flask AI backend
└─ 📄 telegram-bot.js           ← Telegram standalone bot
```

---

## ✅ Checklist Deployment

### First Time Setup
- [ ] Install ngrok
- [ ] Install Vercel CLI
- [ ] Login to Vercel: `vercel login`
- [ ] Link project: `vercel link`
- [ ] Setup ngrok authtoken
- [ ] Setup Vercel environment variables (see VERCEL_ENV_CHECKLIST.md)
- [ ] Test: `.\start-all-backend.bat`
- [ ] Test: `node update-vercel-env.js`
- [ ] Test: `vercel --prod`
- [ ] Access: https://sentra-navy.vercel.app

### Daily Use
- [ ] Start backend: `.\start-all-backend.bat`
- [ ] Update Vercel: `node update-vercel-env.js`
- [ ] Redeploy (if needed): `vercel --prod`
- [ ] Test frontend: https://sentra-navy.vercel.app
- [ ] Check alerts working
- [ ] Check notifications working

### Before Going Home
- [ ] Stop all services (Ctrl+C)
- [ ] Close terminals
- [ ] (Optional) Keep running if needed 24/7

---

## 🎯 Success Indicators

✅ **System Running Correctly:**
1. All services show "RUNNING" in health check
2. Frontend loads at https://sentra-navy.vercel.app
3. Browser console shows "Connected to SENTRA Socket.IO server"
4. CCTV streaming works
5. Accident detection works
6. Notifications sent (Telegram + WhatsApp)

---

## 📦 Tech Stack

### Frontend (Vercel)
- Next.js 14
- React
- TailwindCSS
- Socket.IO Client

### Backend (Laptop)
- Flask (AI Processing)
- YOLOv8 (Object Detection)
- Socket.IO Server
- Node.js
- Telegram Bot API
- WhatsApp API (Fonnte)

### Infrastructure
- ngrok (Tunneling)
- PostgreSQL (Database)
- Prisma (ORM)

---

## 🏆 Best Practices

1. **Always run health check before starting work**
   ```powershell
   .\health-check.bat
   ```

2. **Update Vercel env after ngrok restart**
   ```powershell
   node update-vercel-env.js
   vercel --prod
   ```

3. **Monitor logs for errors**
   - Check terminal windows
   - Check Vercel logs: https://vercel.com/dashboard

4. **Keep ngrok running stable**
   - Don't close ngrok window
   - Consider paid plan for static URLs

5. **Backup data regularly**
   - Database backups via Prisma console
   - Code backups via Git

---

## 📈 Scaling Options (Future)

### Current: Hybrid (Free)
- Frontend: Vercel
- Backend: Laptop
- Cost: ~$0/month

### Option A: Cloud Backend ($20-50/month)
- Frontend: Vercel
- Backend: Railway/Render
- Static ngrok URLs

### Option B: Full Cloud ($100+/month)
- Everything on cloud
- GPU for AI processing
- 99.9% uptime

---

**🎉 Congratulations! SENTRA is deployed!**

Untuk pertanyaan lebih lanjut, lihat dokumentasi terkait di folder ini.

**Happy Monitoring! 🚨📹🤖**
