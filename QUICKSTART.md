# Quick Start Guide - SENTRA

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Dependencies
```powershell
# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt
```

### Step 2: Configure Environment
Create `.env.local` file in the root directory:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/sentra_db
NEXT_PUBLIC_SOCKET_URL=http://localhost:4001
NEXT_PUBLIC_FLASK_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Setup Database
```powershell
# Create database
createdb sentra_db

# Run migration
node scripts/migrate-to-postgres.js
```

### Step 4: Start All Services

**Option A: Using Startup Script (Recommended)**
```powershell
.\start-all.ps1
```

**Option B: Manual Start (3 separate terminals)**

Terminal 1:
```powershell
npm run socket
```

Terminal 2:
```powershell
npm run dev
```

Terminal 3:
```powershell
python app.py
```

### Step 5: Access Application
- **Dashboard**: http://localhost:3000
- **CCTV Monitor**: http://localhost:3000/cctvs
- **Accidents**: http://localhost:3000/accidents

## ✅ Verification Checklist

- [ ] PostgreSQL database created
- [ ] Node modules installed
- [ ] Python packages installed
- [ ] `.env.local` file configured
- [ ] Socket.IO server running (Port 4001)
- [ ] Next.js app running (Port 3000)
- [ ] Flask AI running (Port 5000)
- [ ] Can access http://localhost:3000

## 🎯 First Steps After Setup

1. **Add a CCTV Camera**
   - Go to Dashboard
   - Click "Add CCTV"
   - Enter stream URL: `http://localhost:5000/1` (demo)
   - Enter city: "Test Location"
   - Enter coordinates: Lat: -7.9666, Lon: 112.6326
   - Click "Add CCTV"

2. **View Live Monitoring**
   - Navigate to "CCTV Monitoring" page
   - See the camera streaming with detection boxes
   - Toggle "Show Detections" on/off

3. **Check Real-time Alerts**
   - Watch the right panel for accident alerts
   - The demo video will trigger detections
   - Enable sound and browser notifications

4. **View Statistics**
   - Main dashboard shows charts
   - Change period (24h / 7d / 30d)
   - Click refresh to update

## 🔧 Common Issues

### Port Already in Use
```powershell
# Find and kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Connection Failed
- Verify PostgreSQL is running
- Check username/password in `.env.local`
- Ensure database `sentra_db` exists

### Socket.IO Not Connected
- Ensure Socket.IO server is running first
- Check console for connection errors
- Verify `NEXT_PUBLIC_SOCKET_URL` is correct

### YOLO Model Not Found
- Ensure `test5.pt` is in root directory
- Check model file is not corrupted
- Try downloading model again

## 📚 Next Steps

- Read [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed documentation
- Customize detection parameters in `app.py`
- Add your own CCTV streams
- Configure alert thresholds
- Deploy to production

## 🆘 Need Help?

Check the detailed [SETUP_GUIDE.md](./SETUP_GUIDE.md) or open an issue on GitHub.

---

**Happy Monitoring! 🎥🚨**
