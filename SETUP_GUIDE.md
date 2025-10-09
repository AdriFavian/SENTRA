# SENTRA - Smart Emergency Network for Traffic & Road Accident Detection

A complete AI-powered accident detection system with real-time monitoring, statistics dashboard, and CCTV management.

## 🎯 Features

### 1. **Accident Statistics Dashboard**
- Real-time analytics with daily/weekly/monthly views
- Interactive charts (Bar, Line, Pie) using Chart.js
- Severity distribution visualization (Fatal, Serious, Normal)
- Top accident locations ranking
- Time-based distribution analysis
- 30-day trend analysis

### 2. **CCTV Monitoring and Management (Full CRUD)**
- ✅ **Create**: Add new CCTV cameras with stream URLs
- ✅ **Read**: View all cameras with status indicators
- ✅ **Update**: Edit camera details and configuration
- ✅ **Delete**: Remove cameras from the system
- Live video streaming with HLS.js support (.m3u8)
- Grid and single view modes
- Real-time detection boxes overlay (toggle on/off)
- Preview thumbnails and status badges

### 3. **Real-time Accident Alerts**
- Socket.IO powered instant notifications
- Visual severity indicators (Fatal 🔴, Serious 🟠, Normal 🟡)
- Sound alerts (can be toggled)
- Browser notifications support
- Accident snapshots display
- Timestamp and location information
- Confidence score display

### 4. **AI Detection Backend**
- YOLOv8 model for accident detection
- Supports multiple accident classes
- Automatic severity classification
- Snapshot capture on detection
- Real-time frame processing with configurable skip rate
- Socket.IO integration for instant alerts

## 🛠️ Tech Stack

### Frontend (Next.js)
- **Framework**: Next.js 13+ (App Directory)
- **UI Library**: React 18
- **Styling**: Tailwind CSS + PostCSS + Autoprefixer
- **Charts**: Chart.js + react-chartjs-2
- **Video**: HLS.js for live streaming
- **Real-time**: Socket.IO Client
- **Notifications**: use-sound + Browser Notifications API
- **Maps**: @react-google-maps/api
- **Date**: dayjs

### Backend (Node.js)
- **Runtime**: Node.js
- **Real-time**: Socket.IO Server (Port 4001)
- **Database**: PostgreSQL (via pg)
- **Environment**: dotenv
- **Dev**: nodemon

### Backend (Python AI)
- **Framework**: Flask
- **CORS**: flask-cors
- **AI Model**: YOLOv8 (ultralytics)
- **Computer Vision**: OpenCV (opencv-python)
- **Real-time**: python-socketio
- **Deep Learning**: PyTorch + torchvision

### Database
- **PostgreSQL**: Main database
- **Tables**: 
  - `cctvs` - CCTV camera information
  - `accidents` - Detected accidents with severity

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- PostgreSQL 14+
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd SENTRA
```

### 2. Database Setup
```bash
# Create PostgreSQL database
createdb sentra_db

# Run migration script
node scripts/migrate-to-postgres.js
```

### 3. Environment Configuration
Create `.env.local` in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/sentra_db

# Backend API Configuration
BACKEND_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:4001

# Flask AI Backend
FLASK_AI_URL=http://localhost:5000
NEXT_PUBLIC_FLASK_URL=http://localhost:5000

# Application Settings
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Install Dependencies

#### Frontend & Node.js Backend
```bash
npm install
```

#### Python AI Backend
```bash
pip install -r requirements.txt
```

### 5. YOLO Model
Ensure `test5.pt` (YOLOv8 model) is in the root directory. This model should be trained to detect:
- benturan (collision)
- crash
- moderate-accident
- fatal-accident
- vehicles (kendaraan-besar, roda-2, roda-4)
- humans (manusia)

## 🚀 Running the Application

You need to run 3 separate processes:

### Terminal 1: Socket.IO Server
```bash
npm run socket
```
This starts the Socket.IO server on port 4001.

### Terminal 2: Next.js Frontend
```bash
npm run dev
```
This starts the Next.js application on port 3000.

### Terminal 3: Flask AI Backend
```bash
python app.py
```
This starts the Flask server with YOLO detection on port 5000.

## 📱 Usage

### Access the Application
- **Main Dashboard**: http://localhost:3000
- **CCTV Monitoring**: http://localhost:3000/cctvs
- **Accidents List**: http://localhost:3000/accidents
- **Flask AI Streams**: http://localhost:5000/1, /2, /test

### Adding a CCTV Camera
1. Navigate to the main dashboard
2. Click "Add CCTV" button
3. Fill in the form:
   - **Stream URL**: MJPEG, HLS (.m3u8), or HTTP stream URL
   - **City**: Location name
   - **Latitude/Longitude**: GPS coordinates
   - **Status**: Active/Inactive
4. Click "Add CCTV"

### Monitoring Real-time Feeds
1. Go to "CCTV Monitoring" page
2. Select **Grid View** (multiple cameras) or **Single View**
3. Toggle "Show Detections" to enable/disable detection boxes
4. Click fullscreen icon for fullscreen mode

### Viewing Statistics
1. Main dashboard displays key metrics
2. Use the period selector (24 hours / 7 days / 30 days)
3. Click refresh button to update statistics
4. View interactive charts:
   - Severity distribution (Pie chart)
   - Top locations (Bar chart)
   - Time distribution (Bar chart)
   - 30-day trend (Line chart)

### Managing Alerts
1. Real-time alerts appear in the right panel
2. Toggle sound with the bell icon
3. Enable browser notifications for popup alerts
4. Click "X" to dismiss individual alerts
5. Click "Clear All" to remove all alerts

## 🎥 Video Streaming Setup

### Supported Formats
- **HLS**: `.m3u8` streams (recommended for IP cameras)
- **MJPEG**: Direct JPEG frame streams
- **MP4**: Direct MP4 video files
- **Flask Routes**: `/1`, `/2`, `/test` for demo videos

### Example Stream URLs
```javascript
// HLS Stream
"http://stream.cctv.malangkota.go.id/live/camera1.m3u8"

// MJPEG Stream
"http://192.168.1.100:8080/video"

// Flask AI Stream
"http://localhost:5000/1"
```

## 🔧 Configuration

### Frame Skip Rate (Flask)
Adjust `frame_skip` in `app.py` to control detection frequency:
```python
frame_skip = 5  # Process every 5th frame
```

### Detection Cooldown
Adjust cooldown between detections:
```python
detection_cooldown = 10  # 10 seconds between alerts
```

### Socket.IO Connection
Ensure Socket.IO URL in `.env.local` matches the running server:
```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:4001
```

## 📊 Database Schema

### cctvs Table
```sql
CREATE TABLE cctvs (
  id SERIAL PRIMARY KEY,
  ip_address VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  status BOOLEAN DEFAULT true,
  city VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### accidents Table
```sql
CREATE TABLE accidents (
  id SERIAL PRIMARY KEY,
  accident_classification VARCHAR(50) NOT NULL CHECK (accident_classification IN ('Fatal', 'Serious', 'Normal')),
  photos TEXT,
  cctv_id INTEGER REFERENCES cctvs(id),
  description TEXT,
  confidence DECIMAL(3, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔌 API Endpoints

### Statistics API
```
GET /api/stats?period={daily|weekly|monthly}
```
Returns accident statistics and analytics data.

### CCTV API
```
GET    /api/cctvs          - Get all CCTVs
POST   /api/cctvs          - Create new CCTV
GET    /api/cctvs/:id      - Get CCTV by ID
PUT    /api/cctvs/:id      - Update CCTV
DELETE /api/cctvs/:id      - Delete CCTV
```

### Accidents API
```
GET    /api/accidents      - Get all accidents
POST   /api/accidents      - Create accident report
GET    /api/accidents/:id  - Get accident by ID
```

### Flask AI API
```
GET    /api/status         - Server status
GET    /api/streams        - Available streams
GET    /1                  - Video stream 1
GET    /2                  - Video stream 2
GET    /test               - Test stream
```

## 🎨 Components

### Key Components
- `AccidentStatistics.jsx` - Statistics dashboard with charts
- `LiveVideoPlayer.jsx` - Video player with detection overlay
- `RealtimeAlerts.jsx` - Real-time notification system
- `CctvMonitorGrid.jsx` - CCTV grid management
- `AccidentList.jsx` - List of detected accidents
- `CctvLists.jsx` - CCTV table view
- `GoogleMapComponent.jsx` - Map visualization

## 🐛 Troubleshooting

### Socket.IO Connection Issues
1. Ensure Socket.IO server is running on port 4001
2. Check CORS settings in `helpers/socket/socket.js`
3. Verify `NEXT_PUBLIC_SOCKET_URL` in `.env.local`

### Video Streaming Issues
1. Check stream URL is accessible
2. For HLS: Ensure `.m3u8` file is valid
3. For CORS issues: Enable CORS on stream server
4. Check browser console for errors

### Database Connection Issues
1. Verify PostgreSQL is running
2. Check `DATABASE_URL` in `.env.local`
3. Run migration script again
4. Check database user permissions

### YOLO Detection Issues
1. Ensure `test5.pt` model file exists
2. Check Python dependencies are installed
3. Verify OpenCV can access video files
4. Check Flask console for errors

## 📈 Performance Tips

1. **Increase frame skip** for better performance:
   ```python
   frame_skip = 10  # Process fewer frames
   ```

2. **Limit alert history**:
   ```javascript
   setAlerts(prev => [...prev].slice(0, 20)) // Keep only 20 alerts
   ```

3. **Use smaller YOLO model** for faster detection

4. **Enable database indexing**:
   ```sql
   CREATE INDEX idx_accidents_created ON accidents(created_at);
   CREATE INDEX idx_cctvs_status ON cctvs(status);
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **SENTRA Development Team**

## 🙏 Acknowledgments

- YOLOv8 by Ultralytics
- Next.js by Vercel
- Socket.IO team
- Chart.js team

---

**Built with ❤️ for safer roads**
