# SENTRA - Start All Backend Services (PowerShell)
# More modern alternative to .bat file

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   SENTRA - Production Backend Starter" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if ngrok is installed
if (!(Get-Command ngrok -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] ngrok not found!" -ForegroundColor Red
    Write-Host "Please install ngrok:" -ForegroundColor Yellow
    Write-Host "  1. Download from https://ngrok.com/download" -ForegroundColor Yellow
    Write-Host "  2. Or run: winget install ngrok" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

# Check if ngrok.yml exists
if (!(Test-Path "ngrok.yml")) {
    Write-Host "[ERROR] ngrok.yml not found!" -ForegroundColor Red
    Write-Host "Please make sure ngrok.yml exists in the project root." -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

# Start ngrok tunnels
Write-Host "[1/5] Starting ngrok tunnels..." -ForegroundColor Green
Write-Host "  - Flask Backend (port 5000)" -ForegroundColor Gray
Write-Host "  - Socket.IO Server (port 4001)" -ForegroundColor Gray
Write-Host ""

Start-Process -FilePath "cmd" -ArgumentList "/k", "ngrok start --all --config ngrok.yml"
Start-Sleep -Seconds 5

# Wait for ngrok to be ready
Write-Host "[2/5] Waiting for ngrok to initialize..." -ForegroundColor Green
Start-Sleep -Seconds 3

# Display ngrok URLs
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   ngrok Tunnel URLs" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -ErrorAction Stop
    Write-Host ""
    foreach ($tunnel in $response.tunnels) {
        Write-Host "  $($tunnel.name): $($tunnel.public_url)" -ForegroundColor Green
    }
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "  Could not fetch ngrok URLs. Check manually at:" -ForegroundColor Yellow
    Write-Host "  http://localhost:4040" -ForegroundColor Yellow
    Write-Host ""
}

# Start Socket.IO Server
Write-Host "[3/5] Starting Socket.IO Server..." -ForegroundColor Green
Start-Process -FilePath "cmd" -ArgumentList "/k", "node helpers/socket/socket.js"
Start-Sleep -Seconds 2

# Start Telegram Bot
Write-Host "[4/5] Starting Telegram Bot..." -ForegroundColor Green
Start-Process -FilePath "cmd" -ArgumentList "/k", "node telegram-bot.js"
Start-Sleep -Seconds 2

# Start Flask AI Backend
Write-Host "[5/5] Starting Flask AI Backend..." -ForegroundColor Green
Start-Process -FilePath "cmd" -ArgumentList "/k", "python app.py"
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   All Backend Services Started!" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Running Services:" -ForegroundColor Green
Write-Host "  [1] ngrok Tunnels      - Exposing ports to internet" -ForegroundColor Gray
Write-Host "  [2] Socket.IO Server   - Real-time communication (port 4001)" -ForegroundColor Gray
Write-Host "  [3] Telegram Bot       - Notification handler" -ForegroundColor Gray
Write-Host "  [4] Flask AI Backend   - YOLOv8 Detection (port 5000)" -ForegroundColor Gray
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   IMPORTANT: Next Steps" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Copy ngrok URLs from above" -ForegroundColor Yellow
Write-Host "2. Update Vercel Environment Variables:" -ForegroundColor Yellow
Write-Host "   - Run: " -ForegroundColor Yellow -NoNewline
Write-Host "node update-vercel-env.js" -ForegroundColor White
Write-Host "   OR manually at: " -ForegroundColor Yellow -NoNewline
Write-Host "https://vercel.com/dashboard" -ForegroundColor White
Write-Host ""
Write-Host "3. Redeploy Vercel (if URLs changed):" -ForegroundColor Yellow
Write-Host "   - Run: " -ForegroundColor Yellow -NoNewline
Write-Host "vercel --prod" -ForegroundColor White
Write-Host ""
Write-Host "4. Access your app:" -ForegroundColor Yellow
Write-Host "   - " -ForegroundColor Yellow -NoNewline
Write-Host "https://sentra-navy.vercel.app" -ForegroundColor White
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Press any key to open ngrok dashboard" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
pause

# Open ngrok dashboard
Start-Process "http://localhost:4040"

Write-Host ""
Write-Host "Dashboard opened in browser!" -ForegroundColor Green
Write-Host "Keep all terminal windows open while using SENTRA." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
pause
