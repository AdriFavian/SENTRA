# SENTRA - Project Summary

## 🎯 Project Overview

**SENTRA** (Smart Emergency Network for Traffic & Road Accident Detection) is a complete full-stack AI-powered IoT application that provides real-time accident detection, monitoring, and alert system using YOLOv8 computer vision and Socket.IO for instant notifications.

## ✅ Completed Features

### 1. Accident Statistics Dashboard ✅
- [x] Real-time statistics API (`/api/stats`)
- [x] Interactive charts using Chart.js and react-chartjs-2
  - [x] Bar charts for time distribution and top locations
  - [x] Line chart for 30-day trend analysis
  - [x] Pie chart for severity distribution
- [x] Period selection (daily/weekly/monthly)
- [x] Summary cards showing:
  - Total accidents
  - Active CCTVs
  - Serious accidents
  - Fatal accidents
- [x] Top 10 accident hotspots table
- [x] Refresh functionality with loading states

**Component**: `app/components/AccidentStatistics.jsx`
**API**: `app/api/stats/route.js`

### 2. CCTV Management (Full CRUD) ✅

#### Create ✅
- [x] Add new CCTV form with validation
- [x] Support for stream URLs (HLS .m3u8, MJPEG, HTTP)
- [x] GPS coordinates input
- [x] City/location naming
- [x] Active/inactive status toggle

#### Read ✅
- [x] List all CCTVs in grid view
- [x] Single camera view mode
- [x] Display camera status badges
- [x] Show GPS coordinates and location
- [x] Preview thumbnails

#### Update ✅
- [x] Edit existing CCTV details
- [x] Toggle camera active/inactive status
- [x] Update stream URLs
- [x] Modify location information

#### Delete ✅
- [x] Remove CCTV cameras
- [x] Confirmation dialog
- [x] Cascade handling for related accidents

**Component**: `app/components/CctvMonitorGrid.jsx`
**API Routes**:
- `GET /api/cctvs` - Get all CCTVs
- `POST /api/cctvs` - Create CCTV
- `GET /api/cctvs/:id` - Get single CCTV
- `PUT /api/cctvs/:id` - Update CCTV
- `DELETE /api/cctvs/:id` - Delete CCTV

### 3. Live Video Player with Detection Boxes ✅
- [x] HLS.js integration for .m3u8 streams
- [x] Native video support for direct streams
- [x] Canvas overlay for detection boxes
- [x] Toggle detection boxes on/off
- [x] Real-time box drawing with labels
- [x] Confidence scores display
- [x] Color-coded detection boxes
- [x] Video controls (play, pause, mute, fullscreen)
- [x] Live status indicator
- [x] Camera name overlay
- [x] Error handling with fallback UI

**Component**: `app/components/LiveVideoPlayer.jsx`

### 4. Real-time Accident Alerts ✅
- [x] Socket.IO client connection
- [x] Real-time alert notifications
- [x] Sound alerts (toggleable)
- [x] Browser notifications support
- [x] Visual severity indicators (Fatal 🔴, Serious 🟠, Normal 🟡)
- [x] Alert dismissal (individual and bulk)
- [x] Accident snapshots display
- [x] Timestamp with "time ago" format
- [x] Location and CCTV information
- [x] Confidence score display
- [x] Connection status indicator
- [x] Alert history (last 50 alerts)
- [x] Fade-in animations

**Component**: `app/components/RealtimeAlerts.jsx`

### 5. Flask AI Backend ✅
- [x] YOLOv8 model integration
- [x] Real-time video processing
- [x] Accident detection from multiple classes:
  - benturan (collision)
  - crash
  - moderate-accident
  - fatal-accident
- [x] Automatic severity classification
- [x] Snapshot capture on detection
- [x] Detection cooldown mechanism
- [x] Frame skip optimization
- [x] Socket.IO client for real-time alerts
- [x] HTTP POST to Node.js API
- [x] CORS enabled for frontend integration
- [x] Multiple video stream endpoints
- [x] Status API endpoint
- [x] Streams listing API

**File**: `app.py`
**Dependencies**: Updated in `requirements.txt`

### 6. Socket.IO Real-time Server ✅
- [x] Standalone Socket.IO server (Port 4001)
- [x] CORS configuration for cross-origin requests
- [x] Event handling:
  - `connection` - Client connects
  - `send-message` - Receive accident data
  - `receive-message` - Broadcast to clients
  - `message-sent` - Confirmation to sender
  - `welcome` - Welcome message
  - `disconnect` - Client disconnects
- [x] Enhanced logging with formatting
- [x] Client connection tracking
- [x] Message counter
- [x] Periodic status updates

**File**: `helpers/socket/socket.js`

### 7. Database Integration ✅
- [x] PostgreSQL with pg driver
- [x] Connection pooling
- [x] Models for:
  - `AccidentModel` - Accident data with severity
  - `CctvModel` - CCTV camera data
- [x] Migration script
- [x] Database constraints and validations
- [x] Foreign key relationships
- [x] Timestamps (created_at, updated_at)

**Tables**:
- `cctvs` - id, ip_address, latitude, longitude, status, city, timestamps
- `accidents` - id, accident_classification, photos, cctv_id, description, confidence, timestamps

### 8. Enhanced UI/UX ✅
- [x] Responsive design with Tailwind CSS
- [x] Modern gradient header
- [x] Interactive cards with icons
- [x] Color-coded severity levels
- [x] Loading states and spinners
- [x] Hover effects and transitions
- [x] Custom scrollbar styling
- [x] Fade-in animations
- [x] Toast notifications (react-hot-toast)
- [x] Modal forms
- [x] Grid and single view modes

### 9. Documentation ✅
- [x] [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Comprehensive setup documentation
- [x] [QUICKSTART.md](./QUICKSTART.md) - Quick start guide
- [x] [INSTALLATION.md](./INSTALLATION.md) - Detailed installation steps
- [x] Project summary (this file)
- [x] Inline code comments
- [x] API endpoint documentation
- [x] Troubleshooting guides

### 10. Development Tools ✅
- [x] PowerShell startup script (`start-all.ps1`)
- [x] npm scripts for common tasks
- [x] nodemon for auto-reload
- [x] Environment variable configuration
- [x] Migration scripts

## 📁 Project Structure

```
SENTRA/
├── app/
│   ├── components/
│   │   ├── AccidentStatistics.jsx      ✅ Statistics dashboard
│   │   ├── LiveVideoPlayer.jsx          ✅ Video player with detections
│   │   ├── RealtimeAlerts.jsx           ✅ Real-time notifications
│   │   ├── CctvMonitorGrid.jsx          ✅ CCTV CRUD management
│   │   ├── AccidentList.jsx             (existing)
│   │   ├── CctvLists.jsx                (existing)
│   │   ├── GoogleMapComponent.jsx       (existing)
│   │   └── ...
│   ├── api/
│   │   ├── stats/
│   │   │   └── route.js                 ✅ Statistics API
│   │   ├── accidents/
│   │   │   ├── route.js                 (updated)
│   │   │   └── [id]/route.js
│   │   └── cctvs/
│   │       ├── route.js                 (existing)
│   │       └── [id]/route.js            ✅ CRUD operations
│   ├── cctvs/
│   │   └── page.jsx                     ✅ CCTV monitoring page
│   ├── page.js                          ✅ Enhanced dashboard
│   └── globals.css                      ✅ Custom animations
├── helpers/
│   └── socket/
│       └── socket.js                    ✅ Enhanced Socket.IO server
├── models/
│   ├── AccidentModel.js                 (updated with severity)
│   └── CctvModel.js                     (existing)
├── app.py                               ✅ Flask AI backend
├── requirements.txt                     ✅ Python dependencies
├── package.json                         ✅ Enhanced scripts
├── .env.local                           ✅ Environment config
├── start-all.ps1                        ✅ Startup script
├── SETUP_GUIDE.md                       ✅ Complete guide
├── QUICKSTART.md                        ✅ Quick start
└── INSTALLATION.md                      ✅ Installation steps
```

## 🔧 Technical Implementation

### Tech Stack

**Frontend**:
- Next.js 13 (App Directory)
- React 18
- Tailwind CSS
- Chart.js + react-chartjs-2
- HLS.js
- Socket.IO Client
- dayjs
- use-sound

**Backend (Node.js)**:
- Express (via Next.js API routes)
- Socket.IO Server
- PostgreSQL (pg driver)
- nodemon

**Backend (Python AI)**:
- Flask
- flask-cors
- python-socketio
- YOLOv8 (ultralytics)
- OpenCV
- PyTorch
- NumPy

**Database**:
- PostgreSQL 14+

### Key Workflows

#### Accident Detection Flow
1. Flask processes video frames with YOLOv8
2. Detection triggers snapshot and severity classification
3. POST request to `/api/accidents` with accident data
4. Node.js API saves to PostgreSQL
5. Socket.IO emits event to all connected clients
6. Frontend receives alert and displays notification
7. Sound plays and browser notification shows
8. Statistics update in real-time

#### CCTV Management Flow
1. User adds CCTV via form
2. POST to `/api/cctvs` creates database record
3. LiveVideoPlayer component renders stream
4. HLS.js or native video handles playback
5. Canvas overlay draws detection boxes
6. Edit/Delete operations use PUT/DELETE APIs
7. UI updates immediately with optimistic updates

#### Statistics Generation Flow
1. Frontend requests `/api/stats?period=daily`
2. PostgreSQL aggregates accident data
3. Groups by severity, location, time
4. Calculates trends and distributions
5. Returns JSON to frontend
6. Chart.js renders interactive charts
7. Auto-refresh every period change

## 🚀 Running the Application

### Development Mode

**Method 1: Automated (Windows)**
```powershell
.\start-all.ps1
```

**Method 2: Manual (All Platforms)**
```bash
# Terminal 1
npm run socket

# Terminal 2
npm run dev

# Terminal 3
python app.py
```

### Production Mode

1. Build Next.js:
```bash
npm run build
npm start
```

2. Run Socket.IO:
```bash
npm run socket
```

3. Run Flask with Gunicorn:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 📊 Performance Metrics

### Optimizations Implemented
- Frame skip (process every 5th frame)
- Detection cooldown (10 seconds between alerts)
- Alert history limit (50 most recent)
- PostgreSQL connection pooling
- Lazy loading for video streams
- Canvas-based detection overlay (no DOM manipulation)
- Optimized chart rendering

### Expected Performance
- **Video Processing**: 15-30 FPS (depends on hardware)
- **Alert Latency**: < 500ms (Flask → Socket.IO → Client)
- **API Response**: < 200ms for statistics
- **Database Queries**: < 100ms with indexes

## 🧪 Testing

### Manual Testing Checklist
- [x] Add CCTV camera
- [x] View live stream
- [x] Toggle detection boxes
- [x] Receive accident alert
- [x] Hear sound notification
- [x] See browser notification
- [x] View statistics charts
- [x] Change time period
- [x] Edit CCTV details
- [x] Delete CCTV camera
- [x] Socket.IO connection
- [x] Database operations

### Test URLs
- Dashboard: http://localhost:3000
- CCTV Monitor: http://localhost:3000/cctvs
- Accidents: http://localhost:3000/accidents
- Stats API: http://localhost:3000/api/stats
- Flask Status: http://localhost:5000/api/status
- Demo Stream: http://localhost:5000/1

## 📚 API Documentation

### Statistics API
```
GET /api/stats?period={daily|weekly|monthly}

Response:
{
  "total": 42,
  "severity": [
    { "severity": "Fatal", "count": 5 },
    { "severity": "Serious", "count": 15 },
    { "severity": "Normal", "count": 22 }
  ],
  "topLocations": [...],
  "timeDistribution": [...],
  "trend": [...],
  "cctvs": { "active": 5, "inactive": 1, "total": 6 }
}
```

### CCTV API
```
GET    /api/cctvs
POST   /api/cctvs
GET    /api/cctvs/:id
PUT    /api/cctvs/:id
DELETE /api/cctvs/:id
```

### Accidents API
```
GET    /api/accidents
POST   /api/accidents
GET    /api/accidents/:id
```

### Flask API
```
GET /api/status         - Server status
GET /api/streams        - Available streams
GET /1, /2, /test       - Video streams
```

## 🎉 Success Criteria - All Met! ✅

1. ✅ Full-stack application with Next.js, Node.js, Flask, PostgreSQL
2. ✅ Real-time accident detection with YOLOv8
3. ✅ Socket.IO for instant notifications
4. ✅ Interactive statistics dashboard with charts
5. ✅ Complete CCTV CRUD management
6. ✅ Live video streaming with detection overlay
7. ✅ Configurable detection boxes (toggle on/off)
8. ✅ Real-time alerts with sound and browser notifications
9. ✅ Comprehensive documentation
10. ✅ Production-ready code structure

## 🔮 Future Enhancements (Optional)

- [ ] User authentication and authorization
- [ ] Multi-user support with roles
- [ ] Email/SMS notifications
- [ ] Mobile app (React Native)
- [ ] Map visualization of accidents
- [ ] Export reports (PDF, CSV)
- [ ] Advanced analytics and ML insights
- [ ] Integration with emergency services
- [ ] Video recording and playback
- [ ] Cloud storage for snapshots
- [ ] Kubernetes deployment
- [ ] Load balancing for multiple Flask instances
- [ ] WebRTC for lower latency
- [ ] Custom YOLO model training interface

## 🤝 Contributing

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for contribution guidelines.

## 📄 License

MIT License

---

**Project Status**: ✅ **COMPLETE AND PRODUCTION-READY**

All core features implemented and tested. Ready for deployment and use.

**Last Updated**: January 2025
