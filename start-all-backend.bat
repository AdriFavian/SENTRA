@echo off
REM ============================================
REM SENTRA - Start All Backend Services
REM ============================================
REM This script starts:
REM 1. ngrok tunnels (Flask + Socket.IO)
REM 2. Socket.IO server
REM 3. Telegram Bot
REM 4. Flask AI Backend
REM ============================================

echo.
echo ============================================
echo   SENTRA - Production Backend Starter
echo ============================================
echo.

REM Load environment variables from .env.local
echo [0/5] Loading environment variables...
if exist .env.local (
    for /f "usebackq tokens=1,2 delims==" %%a in (".env.local") do (
        set "%%a=%%b"
    )
    echo   ✅ Environment variables loaded
) else (
    echo   ⚠️  .env.local not found, using system env vars
)
echo.

REM Check if ngrok is installed
where ngrok >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] ngrok not found!
    echo Please install ngrok:
    echo   1. Download from https://ngrok.com/download
    echo   2. Or run: winget install ngrok
    echo.
    pause
    exit /b 1
)

REM Check if ngrok.yml exists
if not exist "ngrok.yml" (
    echo [ERROR] ngrok.yml not found!
    echo Please make sure ngrok.yml exists in the project root.
    echo.
    pause
    exit /b 1
)

REM Kill existing processes on ports 4001 and 5000
echo [1/6] Cleaning up existing processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4001') do (
    if not "%%a"=="0" (
        taskkill /F /PID %%a >nul 2>&1
    )
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    if not "%%a"=="0" (
        taskkill /F /PID %%a >nul 2>&1
    )
)
echo   ✅ Ports cleared
echo.

REM Start ngrok tunnels
echo [2/6] Starting ngrok tunnels...
echo   - Flask Backend (port 5000)
echo   - Socket.IO Server (port 4001)
echo.
start "ngrok Tunnels" cmd /k "ngrok start --all --config ngrok.yml"
timeout /t 5 /nobreak >nul

REM Wait for ngrok to be ready
echo [3/6] Waiting for ngrok to initialize...
timeout /t 3 /nobreak >nul

REM Display ngrok URLs
echo.
echo ============================================
echo   ngrok Tunnel URLs
echo ============================================
powershell -Command "$tunnels = (Invoke-RestMethod http://localhost:4040/api/tunnels).tunnels; Write-Host ''; foreach($t in $tunnels) { Write-Host ('  ' + $t.name + ': ' + $t.public_url) -ForegroundColor Green }; Write-Host ''"

REM Start Socket.IO Server
echo [4/6] Starting Socket.IO Server...
start "Socket.IO Server" cmd /k "node helpers/socket/socket.js"
timeout /t 2 /nobreak >nul

REM Start Telegram Bot
echo [5/6] Starting Telegram Bot...
start "Telegram Bot" cmd /k "node telegram-bot.js"
timeout /t 2 /nobreak >nul

REM Start Flask AI Backend
echo [6/6] Starting Flask AI Backend...
start "Flask AI Backend" cmd /k "python app.py"
timeout /t 2 /nobreak >nul
start "Flask AI Backend" cmd /k "python app.py"
timeout /t 2 /nobreak >nul

echo.
echo ============================================
echo   All Backend Services Started!
echo ============================================
echo.
echo Running Services:
echo   [1] ngrok Tunnels      - Exposing ports to internet
echo   [2] Socket.IO Server   - Real-time communication (port 4001)
echo   [3] Telegram Bot       - Notification handler
echo   [4] Flask AI Backend   - YOLOv8 Detection (port 5000)
echo.
echo ============================================
echo   IMPORTANT: Next Steps
echo ============================================
echo.
echo 1. Copy ngrok URLs from the window above
echo 2. Update Vercel Environment Variables:
echo    - Run: node update-vercel-env.js
echo    OR manually at: https://vercel.com/dashboard
echo.
echo 3. Redeploy Vercel (if URLs changed):
echo    - Run: vercel --prod
echo.
echo 4. Access your app:
echo    - https://sentra-navy.vercel.app
echo.
echo ============================================
echo   Press any key to open ngrok dashboard
echo ============================================
pause >nul

REM Open ngrok dashboard
start http://localhost:4040

echo.
echo Dashboard opened in browser!
echo Keep all terminal windows open while using SENTRA.
echo.
echo Press any key to exit this window...
pause >nul
