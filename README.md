# 🚨 SENTRA - Smart Sensor-based Traffic Accident Alert

## 📖 Introduction

SENTRA is a real-time accident detection system utilizing YOLOv8 and existing CCTV feeds to identify traffic incidents. It provides instant alerts via WebSocket, Telegram, and WhatsApp to facilitate rapid emergency response.

## ✨ Features

- **AI Detection**: YOLOv8-based analysis of live CCTV streams.
- **Real-time Alerts**: WebSocket-driven notifications for immediate incident reporting.
- **Multi-channel Support**: Automated alerts via Telegram and WhatsApp with snapshots.
- **Interactive Dashboard**: Real-time monitoring, statistics, and historical data visualization.
- **Geospatial Data**: Google Maps integration for accident location tracking.
- **Severity Classification**: Automated incident severity grading.
- **Snapshot Capture**: Automatic photo capture when accidents occur
- **Customizable Alerts**: Configure notification contacts per CCTV

## 🏗️ Architecture

**Hybrid Deployment:**

- **Frontend**: Next.js (Vercel)
- **Backend**: Flask + Socket.IO (Local/Edge)
- **Database**: PostgreSQL (Vercel Postgres)
- **Tunneling**: ngrok

See [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md) for details.

## 🚀 Quick Start

### Production Deployment

```bash
# 1. Deploy frontend to Vercel
vercel --prod

# 2. Start backend
start-production.bat

# 3. Sync environment
npm run update-vercel-env
```

### Local Development

```bash
# 1. Install dependencies
npm install
pip install -r requirements.txt

# 2. Configure environment
cp .env.example .env.local
# Update .env.local with credentials

# 3. Start services
npm run dev        # Frontend (3000)
npm run socket     # Socket Server (4001)
python app.py      # AI Backend (5000)
```

- **Real-time Alerts**: Once an accident is detected, SENTRA immediately sends real-time alerts to the concerned authorities. These alerts include precise accident location data, allowing first responders to reach the scene quickly.

- **WhatsApp Notifications**: Integrated WhatsApp notification system sends urgent alerts with accident snapshots, GPS location links, and interactive response buttons to configured emergency contacts.

- **Historical Data Analysis**: The system collects and stores historical accident data, which can be analyzed to identify accident-prone areas and patterns. This information can be used for future highway planning and safety improvements.

## ⚙️ How it Works

1.  **Ingest**: System captures live video feeds from configured CCTV sources.
2.  **Analyze**: YOLOv8 model processes frames to detect anomalies (collisions, sudden stops).
3.  **Alert**: Detected incidents trigger immediate WebSocket events and notification webhooks.
4.  **Archive**: Incident data and snapshots are stored in PostgreSQL for analysis.

## Benefits

- **Improved Response Time**: enable faster response times for first responders, potentially saving lives.

- **Reduced Severity**: By detecting accidents early, SENTRA can help reduce the severity of accidents and minimize damage and injuries.

- **Data-Driven Safety**: Historical data analysis can lead to targeted safety improvements on highways, making them safer for all users.

## Challenges We Faced While Developing the Application

Certainly, here are the challenges faced during the development of the SENTRA system:

1. **Frame Capturing and Frequent POST Requests**:
   - Challenge: Managing the continuous capture of frames from CCTV cameras and executing POST requests for analysis in each frame presented a significant technical challenge. This process required efficient handling of a large volume of data and demanded real-time processing.
2. **Implementing Warning Audio on the Frontend**:
   - Challenge: Integrating warning audio signals on the frontend proved to be a complex task. Playing audio in response to accident detection required careful synchronization and user-friendly controls.
3. **Real-time Data Transmission via Socket.io**:
   - Challenge: Transmitting real-time accident data efficiently through Socket.io posed challenges, particularly when dealing with a large number of connected clients. Ensuring low latency and high reliability was crucial for instant updates.

## 🛠️ Installation

**Prerequisites:** Node.js, Python 3.8+, Git.

```bash
# Clone repository
git clone https://github.com/ABChapagain/SENTRA
cd SENTRA

# Install dependencies
npm install
python -m venv venv
# Windows: venv\Scripts\activate | Linux/Mac: source venv/bin/activate
pip install -r requirements.txt

# Configure
# Copy .env.example to .env and update variables

# Run
python app.py
npm run socket
npm run dev
```

## 📞 Support

For support, contact the maintainers:

- [meprazhant@gmail.com](mailto:meprazhant@gmail.com)
- [achyutchapagain05@gmail.com](mailto:achyutchapagain05@gmail.com)
- [shameerkharel2@gmail.com](mailto:shameerkharel2@gmail.com)
- [rejensraya@gmail.com](mailto:rejensraya@gmail.com)
- [noklent320@gmail.com](mailto:noklent320@gmail.com)

## 📄 License

Open-source.

## ⚠️ Disclaimer

SENTRA is a safety enhancement tool and does not replace responsible driving or official emergency protocols.
