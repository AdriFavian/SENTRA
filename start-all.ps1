# SENTRA Startup Script for Windows PowerShell
# Run this script to start all services

Write-Host "🚀 Starting SENTRA Application..." -ForegroundColor Green
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ Error: .env.local file not found!" -ForegroundColor Red
    Write-Host "Please create .env.local file with database configuration" -ForegroundColor Yellow
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing Node.js dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "Starting services in separate windows..." -ForegroundColor Cyan
Write-Host ""

# Start Socket.IO Server
Write-Host "1️⃣  Starting Socket.IO Server (Port 4001)..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run socket"
Start-Sleep -Seconds 2

# Start Next.js Frontend
Write-Host "2️⃣  Starting Next.js Frontend (Port 3000)..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
Start-Sleep -Seconds 3

# Start Flask AI Backend
Write-Host "3️⃣  Starting Flask AI Backend (Port 5000)..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python app.py"
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "✅ All services started successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Access the application:" -ForegroundColor Cyan
Write-Host "   - Main Dashboard: http://localhost:3000" -ForegroundColor White
Write-Host "   - CCTV Monitoring: http://localhost:3000/cctvs" -ForegroundColor White
Write-Host "   - Accidents List: http://localhost:3000/accidents" -ForegroundColor White
Write-Host "   - Flask AI Status: http://localhost:5000/api/status" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Keep all terminal windows open while using the application" -ForegroundColor Yellow
Write-Host "🛑 Press Ctrl+C in each window to stop services" -ForegroundColor Yellow
Write-Host ""
