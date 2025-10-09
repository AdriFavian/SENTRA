# Installation Instructions - SENTRA

## System Requirements

### Hardware
- **Processor**: Intel Core i5 or equivalent (i7 recommended for AI processing)
- **RAM**: 8GB minimum (16GB recommended)
- **Storage**: 10GB free space
- **GPU**: NVIDIA GPU (optional, for faster YOLO inference)

### Software
- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **Node.js**: Version 18.x or higher
- **Python**: Version 3.9 - 3.11
- **PostgreSQL**: Version 14 or higher
- **Git**: Latest version

## Detailed Installation Steps

### 1. Install Node.js

**Windows:**
1. Download from https://nodejs.org/
2. Run installer (choose LTS version)
3. Verify installation:
```powershell
node --version
npm --version
```

**macOS:**
```bash
brew install node
```

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Install Python

**Windows:**
1. Download from https://www.python.org/downloads/
2. Run installer
3. ✅ **Important**: Check "Add Python to PATH"
4. Verify installation:
```powershell
python --version
pip --version
```

**macOS:**
```bash
brew install python@3.11
```

**Linux:**
```bash
sudo apt update
sudo apt install python3.11 python3-pip
```

### 3. Install PostgreSQL

**Windows:**
1. Download from https://www.postgresql.org/download/windows/
2. Run installer
3. Remember the password you set for user `postgres`
4. Add PostgreSQL bin to PATH

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux:**
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 4. Setup PostgreSQL

**Create Database:**
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE sentra_db;

# Create user (optional)
CREATE USER sentra_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE sentra_db TO sentra_user;

# Exit
\q
```

**Or use command line:**
```powershell
# Windows
createdb -U postgres sentra_db

# macOS/Linux
createdb sentra_db
```

### 5. Clone Repository

```bash
git clone https://github.com/Noklent-Fardian/SENTRA.git
cd SENTRA
```

### 6. Install Node.js Dependencies

```bash
npm install
```

This will install:
- Next.js and React
- Socket.IO client
- Chart.js and react-chartjs-2
- HLS.js for video streaming
- Tailwind CSS
- PostgreSQL client (pg)
- And all other dependencies

### 7. Install Python Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- Flask and flask-cors
- python-socketio
- OpenCV (opencv-python)
- YOLOv8 (ultralytics)
- PyTorch and torchvision
- NumPy, Pandas
- And other dependencies

**Note for Windows users:** If you encounter issues installing OpenCV:
```powershell
pip install opencv-python-headless
```

**Note for GPU support (optional):**
```bash
# Install CUDA-enabled PyTorch (if you have NVIDIA GPU)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

### 8. Configure Environment Variables

Create `.env.local` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/sentra_db

# Backend API Configuration
BACKEND_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:4001

# Flask AI Backend (YOLOv8)
FLASK_AI_URL=http://localhost:5000
NEXT_PUBLIC_FLASK_URL=http://localhost:5000

# Application Settings
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Replace:**
- `YOUR_PASSWORD` with your PostgreSQL password
- Adjust URLs if using different ports

### 9. Run Database Migration

```bash
node scripts/migrate-to-postgres.js
```

This creates the necessary tables:
- `cctvs` - CCTV camera information
- `accidents` - Accident detection records

### 10. Download YOLO Model

Ensure you have `test5.pt` (your trained YOLOv8 model) in the root directory.

**If training your own model:**
```python
from ultralytics import YOLO

# Train
model = YOLO('yolov8n.pt')
model.train(data='accident_dataset.yaml', epochs=100)

# Export
model.export(format='pt')
```

### 11. Test Installation

**Test Database Connection:**
```bash
node -e "require('./utils/connectDB.js').default().then(() => console.log('✅ DB Connected'))"
```

**Test Python Environment:**
```bash
python -c "import cv2, torch; from ultralytics import YOLO; print('✅ Python OK')"
```

**Test YOLO Model:**
```bash
python -c "from ultralytics import YOLO; model = YOLO('test5.pt'); print('✅ Model Loaded')"
```

### 12. Start Application

**Option A: Use startup script (Windows)**
```powershell
.\start-all.ps1
```

**Option B: Manual start (All platforms)**

Terminal 1 - Socket.IO Server:
```bash
npm run socket
```

Terminal 2 - Next.js Frontend:
```bash
npm run dev
```

Terminal 3 - Flask AI Backend:
```bash
python app.py
```

### 13. Verify Installation

Open your browser and check:

1. **Next.js Frontend**: http://localhost:3000
   - Should see the SENTRA dashboard
   
2. **Flask AI Backend**: http://localhost:5000/api/status
   - Should return JSON with status: "online"
   
3. **Socket.IO**: Check browser console
   - Should see "Connected to Socket.IO server"

## Troubleshooting Installation

### Node.js Issues

**Error: `node` is not recognized**
- Add Node.js to PATH
- Restart terminal

**Error: `npm install` fails**
```bash
# Clear cache
npm cache clean --force
# Try again
npm install
```

### Python Issues

**Error: `pip` is not recognized**
- Add Python Scripts to PATH
- Use `python -m pip install -r requirements.txt`

**Error: OpenCV installation fails**
```bash
pip install opencv-python-headless
```

**Error: PyTorch installation fails**
```bash
# CPU version
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

### PostgreSQL Issues

**Error: Database connection refused**
- Ensure PostgreSQL service is running
- Check username/password
- Verify port (default: 5432)

**Error: Database does not exist**
```bash
createdb -U postgres sentra_db
```

### Port Conflicts

**Port 3000 in use:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

**Port 4001 in use:**
```bash
# Windows
netstat -ano | findstr :4001
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:4001 | xargs kill -9
```

**Port 5000 in use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux  
lsof -ti:5000 | xargs kill -9
```

### YOLO Model Issues

**Error: Model file not found**
- Ensure `test5.pt` is in root directory
- Check file permissions

**Error: Model loading fails**
- Verify PyTorch is installed correctly
- Check model file is not corrupted

## Production Deployment

For production deployment, see:
- [Vercel](https://vercel.com/) for Next.js frontend
- [Heroku](https://heroku.com/) or [Railway](https://railway.app/) for Node.js backend
- [AWS EC2](https://aws.amazon.com/ec2/) or [DigitalOcean](https://www.digitalocean.com/) for Flask AI backend
- [Supabase](https://supabase.com/) or [Neon](https://neon.tech/) for PostgreSQL

## Support

If you encounter issues:
1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Review [QUICKSTART.md](./QUICKSTART.md)
3. Open an issue on GitHub

---

**Successfully installed? Continue to [QUICKSTART.md](./QUICKSTART.md)**
