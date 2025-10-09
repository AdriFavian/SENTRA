# 🚨 SENTRA - Smart Emergency Network for Traffic & Road Accident Detection

![Status](https://img.shields.io/badge/status-production--ready-green)
![Next.js](https://img.shields.io/badge/Next.js-13+-black)
![Python](https://img.shields.io/badge/Python-3.9+-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A complete AI-powered accident detection system with real-time monitoring, statistics dashboard, and CCTV management using YOLOv8 computer vision and Socket.IO for instant notifications.

## 🎯 Features

### 📊 Accident Statistics Dashboard
- Real-time analytics with daily/weekly/monthly views
- Interactive charts using Chart.js (Bar, Line, Pie)
- Severity distribution visualization (Fatal, Serious, Normal)
- Top accident locations ranking
- Time-based distribution analysis
- 30-day trend analysis
- Auto-refresh with loading states

### 📹 CCTV Monitoring & Management (Full CRUD)
- ✅ **Create**: Add new CCTV cameras with stream URLs
- ✅ **Read**: View all cameras with status indicators
- ✅ **Update**: Edit camera details and configuration
- ✅ **Delete**: Remove cameras from the system
- Live video streaming with HLS.js support (.m3u8)
- Grid and single view modes
- Real-time detection boxes overlay (toggle on/off)
- Preview thumbnails and status badges

### 🔔 Real-time Accident Alerts
- Socket.IO powered instant notifications
- Visual severity indicators (🔴 Fatal, 🟠 Serious, 🟡 Normal)
- Sound alerts (toggleable)
- Browser notifications support
- Accident snapshots display
- Timestamp and location information
- Confidence score display

### 🤖 AI Detection Backend
- YOLOv8 model for accident detection
- Supports multiple accident classes
- Automatic severity classification
- Snapshot capture on detection
- Real-time frame processing
- Socket.IO integration for instant alerts

## 🛠️ Tech Stack

- **Frontend**: Next.js 13 (App Directory), React 18, Tailwind CSS
- **Charts**: Chart.js + react-chartjs-2
- **Video**: HLS.js for live streaming
- **Real-time**: Socket.IO (Client & Server)
- **Backend**: Node.js + Express (via Next.js API routes)
- **AI Backend**: Flask + YOLOv8 (ultralytics) + OpenCV
- **Database**: PostgreSQL
- **Notifications**: use-sound + Browser Notifications API

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL 14+

### Installation

```bash
# Clone repository
git clone <repository-url>
cd SENTRA

# Install dependencies
npm install
pip install -r requirements.txt

# Setup database
createdb sentra_db
node scripts/migrate-to-postgres.js

# Configure environment
# Create .env.local (see below)
```

### Environment Configuration

Create `.env.local`:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/sentra_db
NEXT_PUBLIC_SOCKET_URL=http://localhost:4001
NEXT_PUBLIC_FLASK_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Running the Application

**Option 1: Automated (Windows)**
```powershell
.\start-all.ps1
```

**Option 2: Manual (3 terminals)**
```bash
# Terminal 1: Socket.IO Server
npm run socket

# Terminal 2: Next.js Frontend
npm run dev

# Terminal 3: Flask AI Backend
python app.py
```

### Access the Application
- **Dashboard**: http://localhost:3000
- **CCTV Monitor**: http://localhost:3000/cctvs
- **Accidents**: http://localhost:3000/accidents

## 📚 Documentation

- [📖 Quick Start Guide](./QUICKSTART.md) - Get started in 5 minutes
- [🔧 Installation Guide](./INSTALLATION.md) - Detailed installation steps
- [📘 Setup Guide](./SETUP_GUIDE.md) - Complete setup documentation
- [🏗️ Architecture](./ARCHITECTURE.md) - System architecture diagrams
- [📋 Project Summary](./PROJECT_SUMMARY.md) - Feature overview

## 🎥 Usage Examples

### Adding a CCTV Camera
1. Navigate to Dashboard
2. Click "Add CCTV"
3. Enter stream URL: `http://localhost:5000/1` (demo)
4. Enter location details and GPS coordinates
5. Click "Add CCTV"

### Viewing Live Streams
1. Go to "CCTV Monitoring" page
2. Select Grid or Single view
3. Toggle "Show Detections" for AI overlay
4. Click fullscreen for immersive view

### Monitoring Alerts
1. Watch right panel for real-time alerts
2. Enable sound and browser notifications
3. View accident snapshots
4. Check severity and confidence scores

## 🔌 API Endpoints

### Statistics
```
GET /api/stats?period={daily|weekly|monthly}
```

### CCTV Management
```
GET    /api/cctvs          - List all CCTVs
POST   /api/cctvs          - Create CCTV
GET    /api/cctvs/:id      - Get CCTV details
PUT    /api/cctvs/:id      - Update CCTV
DELETE /api/cctvs/:id      - Delete CCTV
```

### Accidents
```
GET    /api/accidents      - List all accidents
POST   /api/accidents      - Report accident
GET    /api/accidents/:id  - Get accident details
```

### Flask AI
```
GET /api/status            - Server status
GET /api/streams           - Available streams
GET /1, /2, /test          - Video streams
```

## 📊 Database Schema

```sql
-- CCTVs Table
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

-- Accidents Table
CREATE TABLE accidents (
  id SERIAL PRIMARY KEY,
  accident_classification VARCHAR(50) CHECK (accident_classification IN ('Fatal', 'Serious', 'Normal')),
  photos TEXT,
  cctv_id INTEGER REFERENCES cctvs(id),
  description TEXT,
  confidence DECIMAL(3, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Testing

Run the demo:
1. Start all services
2. Add a CCTV with URL: `http://localhost:5000/1`
3. Watch for automatic accident detections
4. Observe real-time alerts and statistics

## 🐛 Troubleshooting

### Socket.IO Connection Issues
- Ensure Socket.IO server is running on port 4001
- Check `NEXT_PUBLIC_SOCKET_URL` in `.env.local`
- Verify CORS settings

### Video Streaming Issues
- Check stream URL is accessible
- For HLS: Ensure `.m3u8` file is valid
- Check browser console for errors

### Database Connection Issues
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env.local`
- Ensure database exists

See [INSTALLATION.md](./INSTALLATION.md) for detailed troubleshooting.

## 🚀 Deployment

### Production Build
```bash
# Build Next.js
npm run build
npm start

# Run Socket.IO
npm run socket

# Run Flask with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Recommended Services
- **Frontend**: Vercel, Netlify
- **Backend**: Railway, Heroku
- **AI Backend**: AWS EC2, DigitalOcean
- **Database**: Supabase, Neon, Railway

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **SENTRA Development Team**

## 🙏 Acknowledgments

- [YOLOv8](https://github.com/ultralytics/ultralytics) by Ultralytics
- [Next.js](https://nextjs.org/) by Vercel
- [Socket.IO](https://socket.io/) team
- [Chart.js](https://www.chartjs.org/) team

## 📞 Support

For support and questions:
- Open an issue on GitHub
- Check [Documentation](./SETUP_GUIDE.md)
- Review [FAQ](./QUICKSTART.md#common-issues)

---

**Built with ❤️ for safer roads**

⭐ Star this repo if you find it useful!

## Introduction

SENTRA is a cutting-edge system designed to enhance highway safety by integrating with existing CCTV cameras and utilizing machine learning to detect accidents. This system is dedicated to ensuring swift and efficient response to accidents, reducing the severity of incidents, and ultimately saving lives.

## Features

- **Accident Detection**: SENTRA employs advanced machine learning algorithms to analyze live camera feeds from existing CCTV cameras placed on highways. It can swiftly and accurately detect accidents, regardless of the time of day or weather conditions.

- **Real-time Alerts**: Once an accident is detected, SENTRA immediately sends real-time alerts to the concerned authorities. These alerts include precise accident location data, allowing first responders to reach the scene quickly.

- **Traffic Management**: SENTRA can provide real-time traffic data based on accident information. This can help authorities reroute traffic and minimize congestion caused by accidents, improving overall traffic flow.

- **Historical Data Analysis**: The system collects and stores historical accident data, which can be analyzed to identify accident-prone areas and patterns. This information can be used for future highway planning and safety improvements.

## How it Works

1. **Data Collection**: SENTRA collects live camera feed data from existing CCTV cameras on highways.

2. **Machine Learning Analysis**: Advanced machine learning algorithms analyze the camera feeds in real-time, looking for signs of accidents such as sudden stops, collisions, or debris on the road.

3. **Accident Detection**: When an accident is detected, SENTRA triggers alerts, including the accident location, to the concerned authorities and emergency services if configured.

4. **Data Storage and Analysis**: Historical accident data is stored for future analysis, aiding in long-term safety improvements.

## Benefits

- **Improved Response Time**: Swift detection and notification of accidents enable faster response times for first responders, potentially saving lives.

- **Reduced Severity**: By detecting accidents early, SENTRA can help reduce the severity of accidents and minimize damage and injuries.

- **Traffic Flow Improvement**: Real-time traffic information allows for better traffic management, reducing congestion and improving highway efficiency.

- **Data-Driven Safety**: Historical data analysis can lead to targeted safety improvements on highways, making them safer for all users.

## Challenges We Faced While Developing the Application
Certainly, here are the challenges faced during the development of the SENTRA system:

1. **Frame Capturing and Frequent POST Requests**:
   - Challenge: Managing the continuous capture of frames from CCTV cameras and executing POST requests for analysis in each frame presented a significant technical challenge. This process required efficient handling of a large volume of data and demanded real-time processing.
   
2. **Implementing Warning Audio on the Frontend**:
   - Challenge: Integrating warning audio signals on the frontend proved to be a complex task. Playing audio in response to accident detection required careful synchronization and user-friendly controls.
   
3. **Real-time Data Transmission via Socket.io**:
   - Challenge: Transmitting real-time accident data efficiently through Socket.io posed challenges, particularly when dealing with a large number of connected clients. Ensuring low latency and high reliability was crucial for instant updates.

To install and configure SENTRA, follow these steps:

### Prerequisites

- Node.js and npm (Node Package Manager) installed on your machine.
- Python and pip (Python Package Manager) installed on your machine.
- Git installed on your machine.
- Access to the SENTRA GitHub repository.

### Installation Steps

1. **Clone the GitHub Repository**: Open your terminal and navigate to the directory where you want to install SENTRA. Then, clone the GitHub repository using the following command:

   ```bash
   git clone https://github.com/ABChapagain/SENTRA
   ```

  

2. **Navigate to the Project Directory**: Change your current directory to the cloned SENTRA repository:

   ```bash
   cd SENTRA
   ```

3. **Install npm Packages**: Run the following command to install the required Node.js packages using npm:

   ```bash
   npm install
   ```

4. **Install pip Packages**: SENTRA may require certain Python packages. To install these packages, create a virtual environment (recommended) and activate it. Then, use pip to install the required packages:

   ```bash
   # Create a virtual environment (optional but recommended)
   python -m venv venv

   # Activate the virtual environment (Windows)
   venv\Scripts\activate

   # Activate the virtual environment (macOS/Linux)
   source venv/bin/activate

   # Install Python packages
   pip install -r requirements.txt
   ```

5. **Configuration**: SENTRA may require configuration for your specific environment and CCTV camera setup. Refer to the project's documentation or configuration files to set up the system according to your needs.

6. **Build and Start the Server**: Once you have installed the npm packages and configured the system, you can build and start the server using the following command and run this command in a different terminal:

   ```bash
   python app.py
   npm run socket
   npm run dev
   ```

   This command will build the project and start the server.

7. **Adding CCTV Cameras**: Follow the instructions provided in the project documentation to add CCTV cameras and configure their integration with SENTRA.

8. **Tracking Accidents**: Once the system is up and running with your CCTV cameras integrated, SENTRA will automatically track and detect accidents as described in the project's features.

9. **Additional Configuration**: Depending on your specific use case, you may need to further configure the system for advanced features or customizations. Refer to the project's documentation for details.

10. **Testing**: Before deploying SENTRA in a production environment, it's advisable to thoroughly test its functionality and ensure that it meets your requirements.

Now, SENTRA should be up and running, integrated with your CCTV cameras, and capable of detecting accidents and performing other specified tasks. Be sure to consult the project's documentation and seek support from the project maintainers if you encounter any issues or have specific questions about its configuration and usage.

## Support and Contact

For any questions, support, or inquiries, please contact our team at [meprazhant@gmail.com](mailto:meprazhant@gmail.com), [achyutchapagain05@gmail.com](mailto:achyutchapagain05@gmail.com), [shameerkharel2@gmail.com](mailto:shameerkharel2@gmail.com), [rejensraya@gmail.com](mailto:rejensraya@gmail.com), [Noklent Fardian] (noklent320@gmail.com)

## License

SENTRA is released as an open-source collaboration and customization.

## Disclaimer

SENTRA is a tool designed to enhance highway safety, but it is not a replacement for responsible driving and existing safety measures. Always prioritize safe driving practices and follow local traffic laws when using the road.
