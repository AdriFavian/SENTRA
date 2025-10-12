# 🏗️ SENTRA Architecture - Hybrid Deployment

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                        🌍 INTERNET / PUBLIC                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
        
    👥 Users         📱 Telegram      💬 WhatsApp
   (Browser)         Messages        Messages
        │               │               │
        │               │               │
        └───────────────┼───────────────┘
                        │
                        ▼
        
┌───────────────────────────────────────────────────────────────────────┐
│                     ☁️ VERCEL (CLOUD HOSTING)                          │
├───────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  📦 Next.js Frontend                                                   │
│  ├─ Dashboard UI                                                       │
│  ├─ CCTV Management                                                    │
│  ├─ Accident Reports                                                   │
│  └─ Real-time Alerts Display                                           │
│                                                                         │
│  🔌 API Routes (Next.js)                                               │
│  ├─ /api/accidents                                                     │
│  ├─ /api/cctvs                                                         │
│  ├─ /api/telegram                                                      │
│  └─ /api/whatsapp                                                      │
│                                                                         │
│  🗄️ PostgreSQL Database (Vercel Postgres)                             │
│  ├─ accidents table                                                    │
│  ├─ cctvs table                                                        │
│  ├─ telegram_contacts table                                            │
│  └─ whatsapp_contacts table                                            │
│                                                                         │
└───────────────────────────────────────────────────────────────────────┘
                        │
                        │ HTTP/WebSocket
                        │ via ngrok tunnel
                        ▼
┌───────────────────────────────────────────────────────────────────────┐
│                        🌐 NGROK TUNNELS                                │
├───────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  🔒 Tunnel 1: https://xxxx.ngrok-free.app → localhost:5000            │
│     └─ Flask AI Backend                                                │
│                                                                         │
│  🔒 Tunnel 2: https://yyyy.ngrok-free.app → localhost:4001            │
│     └─ Socket.IO Server                                                │
│                                                                         │
└───────────────────────────────────────────────────────────────────────┘
                        │
                        │ Local Network
                        ▼
┌───────────────────────────────────────────────────────────────────────┐
│                    💻 YOUR LAPTOP (LOCAL BACKEND)                      │
├───────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  🤖 Flask AI Backend (Port 5000)                                       │
│  ├─ YOLOv8 Model Loading                                              │
│  ├─ Video Stream Processing                                            │
│  ├─ Accident Detection                                                 │
│  ├─ Confidence Scoring                                                 │
│  └─ Snapshot Generation                                                │
│     └─ Saves to: public/snapshots/                                     │
│                                                                         │
│  ⚡ Socket.IO Server (Port 4001)                                       │
│  ├─ Real-time Event Broadcasting                                       │
│  ├─ Client Connection Management                                       │
│  ├─ Accident Alert Distribution                                        │
│  └─ WebSocket Communication                                            │
│                                                                         │
│  📬 Telegram Bot Service                                               │
│  ├─ Listen for Bot Commands                                            │
│  ├─ Handle Button Callbacks                                            │
│  ├─ Send Notifications with Images                                     │
│  └─ Manage Chat IDs                                                    │
│                                                                         │
│  🎥 CCTV Connections                                                   │
│  ├─ IP Camera Streams (RTSP/HTTP)                                     │
│  ├─ Frame Extraction                                                   │
│  └─ Live Detection Processing                                          │
│                                                                         │
└───────────────────────────────────────────────────────────────────────┘
                        │
                        │ Network Connection
                        ▼
                ┌───────────────┐
                │  📹 IP Cameras │
                │  (CCTV Network)│
                └───────────────┘
```

---

## 🔄 Data Flow Diagram

### Accident Detection Flow:

```
📹 CCTV Camera
    │
    │ (RTSP Stream)
    ▼
💻 Flask Backend (Your Laptop)
    │
    │ Frame Processing
    ▼
🤖 YOLOv8 Model
    │
    │ Detection Result
    ▼
❓ Accident Detected?
    │
    ├─ NO ──► Continue monitoring
    │
    └─ YES
        │
        ├──► 📸 Save Snapshot (public/snapshots/)
        │
        ├──► ⚡ Emit to Socket.IO
        │       │
        │       └──► 📡 Broadcast to Vercel Frontend
        │               │
        │               └──► 🖥️ Update Dashboard (Real-time)
        │
        └──► 💾 POST to Vercel API
                │
                └──► 🗄️ Save to PostgreSQL
                        │
                        ├──► 📱 Trigger Telegram Notifications
                        │       │
                        │       └──► Send to Configured Contacts
                        │
                        └──► 💬 Trigger WhatsApp Notifications
                                │
                                └──► Send via Fonnte API
```

---

## 🔐 Security Flow

```
🌍 Public Internet
    │
    │ HTTPS
    ▼
☁️ Vercel (SSL/TLS)
    │
    │ Environment Variables (Encrypted)
    ▼
🔒 ngrok Secure Tunnels
    │
    │ HTTPS → HTTP (localhost)
    ▼
💻 Your Laptop
    │
    ├──► Flask: localhost:5000 (Not exposed directly)
    ├──► Socket.IO: localhost:4001 (Not exposed directly)
    └──► Database: SSL Connection to Vercel Postgres
```

---

## 📊 Component Responsibilities

| Component | Location | Responsibility | Always On? |
|-----------|----------|----------------|------------|
| **Frontend** | Vercel Cloud | UI, Dashboard, User interactions | ✅ YES |
| **API Routes** | Vercel Cloud | CRUD operations, Business logic | ✅ YES |
| **Database** | Vercel Cloud | Data persistence | ✅ YES |
| **Flask AI** | Your Laptop | AI detection, Video processing | ⚠️ When laptop on |
| **Socket.IO** | Your Laptop | Real-time events | ⚠️ When laptop on |
| **Telegram Bot** | Your Laptop | Bot callbacks, Notifications | ⚠️ When laptop on |
| **ngrok** | Your Laptop | Tunnel to expose laptop services | ⚠️ When laptop on |

---

## 🌐 URL Structure

### Production URLs:

```
Frontend (Vercel):
https://your-app.vercel.app

API Endpoints:
https://your-app.vercel.app/api/accidents
https://your-app.vercel.app/api/cctvs
https://your-app.vercel.app/api/telegram
https://your-app.vercel.app/api/whatsapp

Backend via ngrok:
https://xxxx.ngrok-free.app  (Flask AI)
https://yyyy.ngrok-free.app  (Socket.IO)

Local Development:
http://localhost:3000  (Next.js)
http://localhost:5000  (Flask)
http://localhost:4001  (Socket.IO)
http://localhost:4040  (ngrok Inspector)
```

---

## 💾 Database Schema

```
┌─────────────────────┐
│   accidents         │
├─────────────────────┤
│ id (PK)             │
│ cctv_id (FK)        │
│ photos              │
│ confidence          │
│ classification      │◄──┐
│ status              │   │
│ timestamp           │   │
└─────────────────────┘   │
                          │
┌─────────────────────┐   │
│   cctvs             │   │
├─────────────────────┤   │
│ id (PK)             │───┘
│ ip_address          │
│ latitude            │
│ longitude           │
│ city                │
│ status              │
└─────────────────────┘
         │
         ├──────┐
         │      │
         ▼      ▼
┌──────────────────┐  ┌──────────────────┐
│telegram_contacts │  │whatsapp_contacts │
├──────────────────┤  ├──────────────────┤
│ id (PK)          │  │ id (PK)          │
│ cctv_id (FK)     │  │ cctv_id (FK)     │
│ chat_id          │  │ phone_number     │
│ phone_number     │  │ name             │
│ name             │  │ is_active        │
│ is_active        │  │ created_at       │
│ created_at       │  └──────────────────┘
└──────────────────┘
```

---

## 🔧 Technology Stack

### Frontend (Vercel)
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Custom components
- **Maps**: Google Maps API
- **Charts**: Chart.js / Recharts
- **Real-time**: Socket.IO Client

### Backend (Your Laptop)
- **AI Engine**: Flask + YOLOv8 (Ultralytics)
- **Video Processing**: OpenCV
- **Real-time Server**: Socket.IO
- **Bot Framework**: node-telegram-bot-api
- **WhatsApp**: Fonnte API

### Database
- **RDBMS**: PostgreSQL (Vercel Postgres)
- **ORM**: pg (node-postgres)

### DevOps
- **Hosting**: Vercel (Frontend + Database)
- **Tunneling**: ngrok (Free/Pro)
- **Version Control**: Git + GitHub

---

## 📈 Scalability Considerations

### Current Setup (Hybrid):
- ✅ Frontend scales automatically (Vercel CDN)
- ✅ Database scales with Vercel plan
- ⚠️ Backend limited by laptop resources
- ⚠️ ngrok free = 40 requests/min limit

### Future Upgrades:
1. **Backend to VPS** (DigitalOcean, AWS EC2)
   - No ngrok needed
   - Static IP
   - 24/7 uptime
   
2. **ngrok Pro** ($8/month)
   - Static domain
   - Unlimited requests
   - Better performance

3. **GPU Cloud** (vast.ai, RunPod)
   - Faster AI processing
   - Scalable GPU resources

---

## 🎯 Advantages of This Architecture

✅ **Cost Effective**
- Frontend free on Vercel
- Database free tier (Vercel Postgres)
- Use existing laptop for AI processing

✅ **Performance**
- Frontend on global CDN (fast worldwide)
- AI runs on your GPU (better performance)
- Database close to frontend (low latency)

✅ **Flexibility**
- Easy to upgrade components separately
- Can move backend to cloud later
- Keep using free tiers

✅ **Development**
- Easy local testing
- Clear separation of concerns
- Good for MVP/prototyping

⚠️ **Limitations**
- Backend only runs when laptop on
- ngrok URLs change (free plan)
- Single point of failure (laptop)

---

## 🚀 Migration Path (Future)

```
Current Setup:
Vercel (Frontend + DB) ←─ngrok─→ Laptop (Backend)

Future Option 1 (All Cloud):
Vercel (Frontend + DB + API) + Cloud GPU (AI only)

Future Option 2 (VPS):
Vercel (Frontend) ←→ VPS (Backend + DB + AI)

Future Option 3 (Serverless):
Vercel (Everything) + AWS Lambda (AI processing)
```

---

This architecture gives you the best of both worlds: **professional frontend hosting** with **powerful local AI processing**! 🎉
