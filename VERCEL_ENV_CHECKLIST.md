# ✅ Vercel Environment Variables Checklist

## 📋 Variables yang Harus Ada di Vercel

Login ke: https://vercel.com/dashboard  
Pilih Project: **sentra**  
Go to: **Settings** → **Environment Variables**

---

## 🔐 Required Variables (Permanent - Set Once)

### Database
```
DATABASE_URL = prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19sekFtTDRIcEx3SW1sc184VU1mdGIiLCJhcGlfa2V5IjoiMDFLN0NKRFMxODNCQ1BLUFNRMDg4S0swRDIiLCJ0ZW5hbnRfaWQiOiI3OGUwOWFmM2I3MTRjNTIyNTJhZmFlMDk0ZGIyZGQzNTcxZTZiZmE3Yjg5MWQ3ZWE2OTliN2Y4OWRhMmFkZjIwIiwiaW50ZXJuYWxfc2VjcmV0IjoiMzczNmFkMDEtNzhlYS00MGM0LTg2Y2ItM2UyMmYzNWUxMmU3In0.AcUIEL-2zcqKqWbs-BirJe-x6vh0sQprmGYOLhuH_a8
```

### Backend API
```
BACKEND_API_URL = https://sentra-navy.vercel.app/api
```

### WhatsApp (Fonnte)
```
FONNTE_TOKEN = UEKGM5BfP2L1DMb8zaR5
```

### Telegram
```
TELEGRAM_BOT_TOKEN = 7679014881:AAF-omBg9MxAKKRHb79_KcSO9liqZ8FNwQ4
```

### Google Maps
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = AIzaSyDKy5gJT7C1SZSJ2yEIQV54JWVLK9NYmT0
```

### Features
```
NEXT_PUBLIC_ENABLE_ANALYTICS = true
```

---

## 🔄 Dynamic Variables (Update Setiap ngrok Restart)

### Flask Backend URLs
```
FLASK_AI_URL = https://xxxx-xxx-xxx-xxx.ngrok-free.app
NEXT_PUBLIC_FLASK_URL = https://xxxx-xxx-xxx-xxx.ngrok-free.app
```

### Socket.IO URL
```
NEXT_PUBLIC_SOCKET_URL = https://yyyy-yyy-yyy-yyy.ngrok-free.app
```

### Public URL untuk Notifications
```
NGROK_URL = https://xxxx-xxx-xxx-xxx.ngrok-free.app
```

---

## 🤖 Cara Update Dynamic Variables

### Otomatis (RECOMMENDED)
```powershell
node update-vercel-env.js
```

### Manual
1. Start ngrok: `ngrok start --all --config ngrok.yml`
2. Salin URLs dari terminal
3. Update di Vercel Dashboard
4. Redeploy: `vercel --prod`

---

## ⚠️ Important Notes

1. **Dynamic variables** akan berubah setiap kali ngrok restart (free tier)
2. Untuk URL tetap, upgrade ke **ngrok paid plan** ($8/month)
3. Setiap update environment variables di Vercel, **HARUS redeploy** agar berlaku
4. Set all variables untuk environment: **Production, Preview, Development**

---

## 🧪 Testing Setelah Setup

### Test Connection
```powershell
# Test Socket.IO
curl https://YOUR-SOCKET-NGROK.ngrok-free.app

# Test Flask
curl https://YOUR-FLASK-NGROK.ngrok-free.app
```

### Test di Browser
1. Buka: https://sentra-navy.vercel.app
2. Check browser console
3. Harus muncul: "Connected to SENTRA Socket.IO server"

---

## 📞 Quick Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **ngrok Dashboard:** https://dashboard.ngrok.com
- **Database Console:** https://console.prisma.io

---

✅ Checklist this after first setup!
