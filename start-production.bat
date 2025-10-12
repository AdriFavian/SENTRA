@echo off
echo ============================================
echo    SENTRA Production Backend Starter
echo ============================================
echo.
echo Starting all backend services...
echo.

REM Check if ngrok.yml exists, if not create it
if not exist "ngrok.yml" (
    echo Creating ngrok.yml...
    (
        echo version: "2"
        echo authtoken: 2yXbAG4P6guFUQqrHAYH2oKr98m_6d99QR3Wt1RAceTQWdWEj
        echo tunnels:
        echo   flask:
        echo     proto: http
        echo     addr: 5000
        echo   socket:
        echo     proto: http
        echo     addr: 4001
    ) > ngrok.yml
)

REM Start ngrok tunnels
echo [1/4] Starting ngrok for Flask (port 5000)...
start "ngrok - Flask" cmd /k "ngrok http 5000"
timeout /t 3

echo [2/4] Starting ngrok for Socket.IO (port 4001)...
start "ngrok - Socket" cmd /k "ngrok http 4001"
timeout /t 3

REM Start Node.js backend (Socket.IO + Telegram Bot)
echo [3/4] Starting Socket.IO and Telegram Bot...
start "Node Backend" cmd /k "npm run backend"
timeout /t 3

REM Start Flask AI backend
echo [4/4] Starting Flask AI Backend...
start "Flask AI" cmd /k "python app.py"
timeout /t 2

echo.
echo ============================================
echo    All Services Started!
echo ============================================
echo.
echo WINDOWS OPENED:
echo 1. ngrok - Flask (port 5000)
echo 2. ngrok - Socket (port 4001)
echo 3. Node Backend (Socket.IO + Telegram)
echo 4. Flask AI (YOLOv8)
echo.
echo NEXT STEPS:
echo.
echo 1. Open ngrok inspector: http://localhost:4040
echo 2. Copy both ngrok URLs
echo 3. Run: get-ngrok-urls.bat (to see URLs)
echo 4. Update Vercel environment variables
echo 5. Redeploy Vercel
echo.
echo Press any key to exit (services will keep running)...
pause > nul