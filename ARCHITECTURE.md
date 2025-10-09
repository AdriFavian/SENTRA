# SENTRA - System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SENTRA ARCHITECTURE                                │
│                 Smart Emergency Network for Traffic Detection                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER (Browser)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌───────────────┐  ┌──────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Dashboard   │  │ CCTV Monitor │  │  Statistics │  │  Accidents  │    │
│  │   (Home)      │  │   (Grid)     │  │   (Charts)  │  │    (List)   │    │
│  └───────┬───────┘  └──────┬───────┘  └──────┬──────┘  └──────┬──────┘    │
│          │                  │                  │                 │            │
│          └──────────────────┴──────────────────┴─────────────────┘           │
│                                      │                                        │
│                                      ▼                                        │
│          ┌───────────────────────────────────────────────────┐              │
│          │           Next.js App (Port 3000)                  │              │
│          │  • Server Components    • API Routes              │              │
│          │  • Client Components    • Socket.IO Client        │              │
│          │  • Tailwind CSS         • Chart.js                │              │
│          └───────────────┬───────────────────┬───────────────┘              │
│                          │                    │                               │
└──────────────────────────┼────────────────────┼───────────────────────────────┘
                           │                    │
                           │                    │
         ┌─────────────────┼────────────────────┼─────────────────┐
         │                 │                    │                  │
         ▼                 ▼                    ▼                  ▼

┌────────────────┐  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐
│   PostgreSQL   │  │  Socket.IO  │  │   REST API   │  │  Flask AI      │
│   Database     │  │   Server    │  │  (Next.js)   │  │   Backend      │
│                │  │             │  │              │  │                │
│  Port: 5432    │  │  Port: 4001 │  │  Port: 3000  │  │  Port: 5000    │
└────────┬───────┘  └──────┬──────┘  └──────┬───────┘  └────────┬───────┘
         │                 │                  │                   │
         │                 │                  │                   │
┌────────┴───────┐  ┌──────┴──────┐  ┌────────┴───────┐  ┌──────┴────────┐
│                │  │             │  │                │  │               │
│  • cctvs      │  │ Real-time   │  │ API Endpoints: │  │ YOLOv8 Model  │
│  • accidents  │  │ Events:     │  │ • /api/stats   │  │               │
│  • indexes    │  │ • connect   │  │ • /api/cctvs   │  │ Detection:    │
│  • relations  │  │ • send-msg  │  │ • /api/accidents│  │ • benturan   │
│                │  │ • receive   │  │                │  │ • crash       │
│                │  │ • disconnect│  │                │  │ • moderate    │
│                │  │             │  │                │  │ • fatal       │
└────────────────┘  └─────────────┘  └────────────────┘  └───────────────┘


═══════════════════════════════════════════════════════════════════════════════
                            DATA FLOW DIAGRAM
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────┐
│  Video Source   │  (CCTV / IP Camera / Video File)
│  (RTSP/HLS/MP4) │
└────────┬────────┘
         │
         │ Video Stream
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Flask AI Backend (app.py)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  1. Capture Frame → 2. YOLO Detection → 3. Classify Severity                │
│                                                                               │
│  ┌──────────┐      ┌──────────┐       ┌────────────┐                        │
│  │ OpenCV   │  →   │ YOLOv8   │   →   │ Severity   │                        │
│  │ Capture  │      │ Predict  │       │ Detection  │                        │
│  └──────────┘      └──────────┘       └────────────┘                        │
│                                              │                                │
│                                              ▼                                │
│                        ┌──────────────────────────────────┐                 │
│                        │   IF accident detected:          │                 │
│                        │   • Take snapshot                │                 │
│                        │   • Classify severity            │                 │
│                        │   • Generate unique ID           │                 │
│                        └──────────────┬───────────────────┘                 │
│                                       │                                      │
└───────────────────────────────────────┼──────────────────────────────────────┘
                                        │
                        ┌───────────────┴───────────────┐
                        │                               │
                        ▼                               ▼
        ┌───────────────────────────┐   ┌──────────────────────────┐
        │  POST /api/accidents      │   │  Socket.IO Emit Event    │
        │  (Next.js API)            │   │  to Node.js Server       │
        └─────────────┬─────────────┘   └────────────┬─────────────┘
                      │                              │
                      ▼                              ▼
        ┌───────────────────────────┐   ┌──────────────────────────┐
        │  PostgreSQL Database      │   │  Socket.IO Server        │
        │  • Save accident record   │   │  • Broadcast to clients  │
        │  • Link to CCTV           │   │                          │
        └─────────────┬─────────────┘   └────────────┬─────────────┘
                      │                              │
                      │                              │
                      └──────────────┬───────────────┘
                                     │
                                     ▼
                      ┌──────────────────────────────┐
                      │   Frontend Clients           │
                      │   • Update alerts panel      │
                      │   • Play sound notification  │
                      │   • Show browser notification│
                      │   • Update statistics        │
                      └──────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                         COMPONENT INTERACTION MAP
═══════════════════════════════════════════════════════════════════════════════

Dashboard (page.js)
    │
    ├─→ AccidentStatistics.jsx
    │       │
    │       └─→ Fetches: /api/stats
    │           └─→ Displays: Chart.js charts
    │
    ├─→ RealtimeAlerts.jsx
    │       │
    │       ├─→ Connects: Socket.IO (4001)
    │       ├─→ Listens: 'receive-message'
    │       ├─→ Plays: warning.mp3
    │       └─→ Shows: Browser notifications
    │
    └─→ CctvLists.jsx
            └─→ Fetches: /api/cctvs

CCTV Monitor (cctvs/page.jsx)
    │
    └─→ CctvMonitorGrid.jsx
            │
            ├─→ Fetches: /api/cctvs
            ├─→ CRUD Operations:
            │       • POST /api/cctvs
            │       • PUT /api/cctvs/:id
            │       • DELETE /api/cctvs/:id
            │
            └─→ LiveVideoPlayer.jsx
                    │
                    ├─→ HLS.js (for .m3u8)
                    ├─→ Canvas overlay (detections)
                    └─→ Video controls


═══════════════════════════════════════════════════════════════════════════════
                          DATABASE SCHEMA
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────┐
│           cctvs                     │
├─────────────────────────────────────┤
│ • id (SERIAL PRIMARY KEY)           │
│ • ip_address (VARCHAR)              │
│ • latitude (DECIMAL)                │
│ • longitude (DECIMAL)               │
│ • status (BOOLEAN)                  │
│ • city (VARCHAR)                    │
│ • created_at (TIMESTAMP)            │
│ • updated_at (TIMESTAMP)            │
└──────────────┬──────────────────────┘
               │
               │ Foreign Key
               │
               ▼
┌─────────────────────────────────────┐
│         accidents                   │
├─────────────────────────────────────┤
│ • id (SERIAL PRIMARY KEY)           │
│ • accident_classification (VARCHAR) │
│   (Fatal, Serious, Normal)          │
│ • photos (TEXT)                     │
│ • cctv_id (INTEGER FK)    ◄─────────┘
│ • description (TEXT)                │
│ • confidence (DECIMAL)              │
│ • created_at (TIMESTAMP)            │
│ • updated_at (TIMESTAMP)            │
└─────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                        REAL-TIME COMMUNICATION FLOW
═══════════════════════════════════════════════════════════════════════════════

   Flask Backend              Socket.IO Server           Frontend Clients
   (Port 5000)                (Port 4001)                (Browser)
        │                           │                           │
        │  1. Accident Detected     │                           │
        ├──────────────────────────►│                           │
        │   emit('send-message')    │                           │
        │                           │                           │
        │                           │  2. Broadcast             │
        │                           ├──────────────────────────►│
        │                           │   emit('receive-message') │
        │                           │                           │
        │                           │                           │  3. Update UI
        │                           │                           ├───────────┐
        │                           │                           │  • Alert  │
        │                           │                           │  • Sound  │
        │                           │                           │  • Notif  │
        │                           │                           │◄──────────┘
        │                           │                           │
        │                           │  4. Confirmation          │
        │                           │◄──────────────────────────┤
        │                           │   emit('message-sent')    │
        │                           │                           │


═══════════════════════════════════════════════════════════════════════════════
                            TECHNOLOGY STACK
═══════════════════════════════════════════════════════════════════════════════

┌────────────────────────────────────────────────────────────────────────────┐
│ Frontend (Client-Side)                                                     │
├────────────────────────────────────────────────────────────────────────────┤
│ • Next.js 13 (App Directory, React 18)                                     │
│ • Tailwind CSS (Styling)                                                   │
│ • Chart.js + react-chartjs-2 (Charts)                                      │
│ • HLS.js (Video Streaming)                                                 │
│ • Socket.IO Client (Real-time)                                             │
│ • dayjs (Date/Time)                                                        │
│ • use-sound (Audio Alerts)                                                 │
│ • react-hot-toast (Notifications)                                          │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│ Backend (Server-Side - Node.js)                                            │
├────────────────────────────────────────────────────────────────────────────┤
│ • Next.js API Routes (REST API)                                            │
│ • Socket.IO Server (Real-time Communication)                               │
│ • PostgreSQL + pg (Database)                                               │
│ • nodemon (Auto-reload)                                                    │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│ Backend (AI Processing - Python)                                           │
├────────────────────────────────────────────────────────────────────────────┤
│ • Flask (Web Framework)                                                    │
│ • flask-cors (CORS)                                                        │
│ • YOLOv8 / ultralytics (Object Detection)                                  │
│ • OpenCV (Computer Vision)                                                 │
│ • PyTorch + torchvision (Deep Learning)                                    │
│ • python-socketio (Real-time Client)                                       │
│ • NumPy (Numerical Computing)                                              │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│ Database                                                                   │
├────────────────────────────────────────────────────────────────────────────┤
│ • PostgreSQL 14+                                                           │
│ • Tables: cctvs, accidents                                                 │
│ • Constraints: Foreign keys, CHECK constraints                             │
│ • Indexes: Primary keys, timestamps                                        │
└────────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                          DEPLOYMENT PORTS
═══════════════════════════════════════════════════════════════════════════════

    Port 3000  →  Next.js Frontend + API Routes
    Port 4001  →  Socket.IO Server (Real-time)
    Port 5000  →  Flask AI Backend (YOLO)
    Port 5432  →  PostgreSQL Database


═══════════════════════════════════════════════════════════════════════════════
                          KEY FEATURES SUMMARY
═══════════════════════════════════════════════════════════════════════════════

✅ Real-time Accident Detection (YOLOv8)
✅ Live Video Streaming (HLS/MJPEG)
✅ Detection Box Overlay (Toggle On/Off)
✅ Interactive Statistics Dashboard
✅ Full CCTV CRUD Management
✅ Socket.IO Real-time Alerts
✅ Sound + Browser Notifications
✅ Severity Classification (Fatal/Serious/Normal)
✅ PostgreSQL Database Integration
✅ Responsive UI with Tailwind CSS
✅ Chart.js Visualizations
✅ Multi-camera Support
✅ GPS Location Tracking
✅ Snapshot Capture
✅ Confidence Scores

