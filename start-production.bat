@echo off
echo ============================================
echo    SENTRA Production Backend Starter
echo ============================================
echo.
echo Starting all backend services...
echo.

REM Start ngrok in a new window
echo [1/3] Starting ngrok tunnels...
start "ngrok Tunnels" cmd /k "ngrok start --all --config ngrok.yml"
timeout /t 5

REM Start Node.js backend (Socket.IO + Telegram Bot)
echo [2/3] Starting Socket.IO and Telegram Bot...
start "Node Backend" cmd /k "npm run backend"
timeout /t 3

REM Start Flask AI backend
echo [3/3] Starting Flask AI Backend...
start "Flask AI" cmd /k "python app.py"
timeout /t 2

echo.
echo ============================================
echo    All Services Started!
echo ============================================
echo.
echo IMPORTANT STEPS:
echo.
echo 1. Check ngrok window for URLs
echo 2. Copy the ngrok URLs
echo 3. Update Vercel environment variables:
echo    - NEXT_PUBLIC_SOCKET_URL
echo    - NEXT_PUBLIC_FLASK_URL
echo    - NGROK_URL
echo 4. Redeploy Vercel project
echo.
echo ngrok Web Interface: http://localhost:4040
echo.
echo Press any key to exit (services will keep running)...
pause > nul
