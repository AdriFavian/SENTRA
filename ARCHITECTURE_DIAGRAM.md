# 📊 SENTRA - Hybrid Deployment Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                          🌐 INTERNET / PUBLIC ACCESS                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
                    ▼                                   ▼
         ┌──────────────────────┐           ┌──────────────────────┐
         │                      │           │                      │
         │   ☁️  VERCEL CLOUD    │           │  💻 LAPTOP / SERVER   │
         │                      │           │     (Anda)           │
         │  Next.js Frontend    │◄─────────►│                      │
         │  (Always Online)     │  ngrok    │  Backend Services:   │
         │                      │  tunnel   │  - Flask (AI)        │
         │  sentra-navy         │  HTTPS    │  - Socket.IO         │
         │  .vercel.app         │           │  - Telegram Bot      │
         │                      │           │                      │
         └──────────┬───────────┘           └──────────┬───────────┘
                    │                                   │
                    │                                   │
                    ▼                                   ▼
         ┌──────────────────────┐           ┌──────────────────────┐
         │                      │           │                      │
         │  🗄️  DATABASE         │           │  🎯 YOLO AI MODEL     │
         │                      │           │                      │
         │  Prisma Accelerate   │           │  YOLOv8 Detection    │
         │  PostgreSQL          │           │  Real-time CCTV      │
         │  (Cloud)             │           │  Processing          │
         │                      │           │                      │
         └──────────────────────┘           └──────────────────────┘
```

---

## 🔄 Request Flow

### 1️⃣ User Mengakses Website

```
User Browser
    │
    ├─► https://sentra-navy.vercel.app
    │
    ▼
Vercel Frontend (Next.js)
    │
    ├─► Load HTML/CSS/JS
    └─► Return to User
```

### 2️⃣ Real-time Alerts (Socket.IO)

```
Flask AI Backend (Laptop)
    │
    ├─► Detect Accident via YOLO
    │
    ▼
Socket.IO Server (Laptop)
    │
    ├─► Emit 'send-message' event
    │
    ▼
ngrok Tunnel
    │
    ├─► https://yyyy.ngrok-free.app
    │
    ▼
Vercel Frontend
    │
    ├─► Receive 'receive-message' event
    │
    ▼
User Browser
    │
    └─► Show Alert Popup 🚨
```

### 3️⃣ AI Detection

```
CCTV Stream
    │
    ▼
Flask Backend (Laptop)
    │
    ├─► YOLOv8 Model Processing
    │
    ├─► Detect Accident
    │
    ▼
Save to Database
    │
    ├─► Prisma → PostgreSQL
    │
    ▼
Trigger Notifications
    │
    ├─► Socket.IO → Frontend Alert
    ├─► Telegram Bot → Telegram Message
    └─► WhatsApp API → WhatsApp Message
```

### 4️⃣ Telegram Notifications

```
Accident Detected
    │
    ▼
Telegram Bot (Laptop)
    │
    ├─► Get CCTV Contacts
    │
    ▼
Send Message
    │
    ├─► Photo + Location + Buttons
    │
    ▼
Telegram Users
    │
    ├─► Press "Tangani" or "Tolak"
    │
    ▼
Bot Handles Callback
    │
    ├─► Update Database
    └─► Notify Other Users
```

---

## 🚀 ngrok Tunnels Explained

```
┌─────────────────────────────────────────────────────────────┐
│                     YOUR LAPTOP (localhost)                 │
│                                                             │
│  Port 5000 (Flask)  ◄──┐                                   │
│  Port 4001 (Socket) ◄──┤                                   │
│                        │                                    │
└────────────────────────┼────────────────────────────────────┘
                         │
                         │ ngrok creates secure tunnels
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   NGROK CLOUD SERVERS                       │
│                                                             │
│  https://xxxx.ngrok-free.app (Flask)   ◄── Public HTTPS    │
│  https://yyyy.ngrok-free.app (Socket)  ◄── Public HTTPS    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
                   INTERNET ACCESS
                         │
                         ▼
                  Vercel Frontend
                         │
                         ▼
                   User Browsers
```

---

## 🔐 Security Flow

```
User Request
    │
    ├─► HTTPS (TLS/SSL)
    │
    ▼
Vercel (Trusted)
    │
    ├─► Environment Variables (Encrypted)
    │
    ▼
ngrok Tunnel
    │
    ├─► HTTPS (TLS/SSL)
    │
    ▼
Laptop Backend (Localhost)
    │
    ├─► Process Request
    │
    ▼
Database (Encrypted Connection)
```

---

## 📦 Component Responsibilities

### ☁️ Vercel (Cloud)
- **Hosting:** Next.js frontend
- **CDN:** Global edge network
- **SSL:** Automatic HTTPS
- **Scaling:** Auto-scale based on traffic
- **Environment:** Secure env variables

### 💻 Laptop (Local)
- **Flask:** AI processing (YOLOv8)
- **Socket.IO:** Real-time communication
- **Telegram Bot:** Notification handler
- **Processing:** Heavy computation

### 🌉 ngrok (Bridge)
- **Tunneling:** Expose localhost to internet
- **HTTPS:** Secure tunnels
- **No Firewall:** Bypass NAT/firewall
- **URLs:** Temporary public URLs

### 🗄️ Database (Cloud)
- **PostgreSQL:** Prisma Accelerate
- **Storage:** Accidents, CCTVs, Contacts
- **Connection:** From both Vercel & Laptop

---

## ⚙️ Environment Variables Flow

```
LAPTOP (.env.local)                    VERCEL (Environment Variables)
────────────────────                   ──────────────────────────────
DATABASE_URL ──────────────────┐       DATABASE_URL (same)
TELEGRAM_BOT_TOKEN             │       TELEGRAM_BOT_TOKEN (same)
FONNTE_TOKEN                   ├──────►FONNTE_TOKEN (same)
                               │       
FLASK_AI_URL (localhost:5000)  │       FLASK_AI_URL (ngrok URL)
NEXT_PUBLIC_SOCKET_URL         │       NEXT_PUBLIC_SOCKET_URL (ngrok URL)
  (localhost:4001)             └──────►NGROK_URL (ngrok URL)
```

---

## 🎯 Data Flow Timeline

```
0s   │ User opens https://sentra-navy.vercel.app
     │
1s   │ Vercel sends Next.js frontend
     │
2s   │ Frontend connects to Socket.IO (ngrok URL)
     │
3s   │ Frontend loads CCTV list from database
     │
     │ [SYSTEM READY]
     │
     ▼ User adds CCTV with IP address
     │
5s   │ Frontend sends request to Flask (ngrok URL)
     │
6s   │ Flask starts YOLO detection on CCTV stream
     │
     │ [MONITORING ACTIVE]
     │
     ▼ YOLO detects accident
     │
10s  │ Flask saves to database
     │
11s  │ Flask emits to Socket.IO
     │
12s  │ Socket.IO broadcasts to all connected clients
     │
13s  │ Frontend shows alert popup 🚨
     │
14s  │ Telegram Bot sends notifications
     │
15s  │ WhatsApp API sends messages
     │
     │ [ALERT DELIVERED]
```

---

## 💡 Why This Architecture?

### ✅ Advantages

1. **Cost Effective**
   - Vercel: Free tier sufficient
   - Backend: Use existing laptop
   - No cloud GPU needed

2. **AI Processing**
   - YOLOv8 runs on laptop GPU
   - No expensive cloud AI services
   - Full control over model

3. **Real-time Performance**
   - Socket.IO on same network as Flask
   - Low latency for detection
   - Fast notification delivery

4. **Easy Development**
   - Test backend locally
   - Frontend auto-deployed
   - Separate concerns

### ⚠️ Limitations

1. **Laptop must be online**
   - Backend services must run 24/7
   - Need stable internet connection

2. **ngrok Free Tier**
   - URLs change on restart
   - Must update Vercel env vars
   - Solution: Upgrade to paid ($8/month)

3. **Single Point of Failure**
   - If laptop off, AI detection stops
   - Frontend still works, but no new detections

---

## 🔧 Scaling Options (Future)

### Option A: Deploy Backend to Cloud
- **Flask:** Railway, Render, AWS EC2
- **Socket.IO:** Railway, Render
- **Cost:** ~$20-50/month
- **Uptime:** 99.9%

### Option B: Hybrid + Backup
- **Primary:** Laptop (cost-free)
- **Backup:** Cloud serverless functions
- **Auto-switch:** When laptop offline

### Option C: Full Cloud
- **All services:** Cloud deployment
- **Cost:** ~$100+/month (with GPU)
- **Best:** Enterprise production

---

**📌 Current Architecture: Hybrid (Best for MVP & Development)**

✅ Cost: Almost free  
✅ Performance: Excellent  
✅ Development: Easy  
⚠️ Uptime: Depends on laptop
