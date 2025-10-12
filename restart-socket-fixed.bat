@echo off
REM ============================================
REM SENTRA - Restart Socket.IO with CORS Fix
REM ============================================

echo.
echo ============================================
echo   SENTRA - Socket.IO CORS Fix Applied
echo ============================================
echo.

echo [1/4] Stopping existing processes...
taskkill /F /IM ngrok.exe >nul 2>&1
taskkill /F /IM node.exe /FI "WINDOWTITLE eq Socket.IO*" >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/4] Starting ngrok with CORS-fixed configuration...
start "ngrok - Socket.IO (CORS Fixed)" cmd /k "ngrok start socket --config ngrok.yml"
echo    Waiting 8 seconds for ngrok to establish tunnel...
timeout /t 8

echo [3/4] Starting Socket.IO server with HTTP-level CORS...
start "Socket.IO Server (CORS Fixed)" cmd /k "node helpers/socket/socket.js"
timeout /t 3

echo [4/4] Verifying services...
echo.
echo Checking ngrok tunnel...
curl -s http://localhost:4040/api/tunnels > nul 2>&1
if %errorlevel%==0 (
    echo    ✅ ngrok is running
    powershell -Command "$tunnels = (Invoke-RestMethod http://localhost:4040/api/tunnels).tunnels; $socket = $tunnels | Where-Object {$_.name -eq 'socket'}; if ($socket) { Write-Host ('    🔗 Socket.IO URL: ' + $socket.public_url) -ForegroundColor Green } else { Write-Host '    ⚠️  Socket tunnel not found' -ForegroundColor Yellow }"
) else (
    echo    ❌ ngrok is NOT running
)

echo.
echo Checking Socket.IO server...
curl -s http://localhost:4001 > nul 2>&1
if %errorlevel%==0 (
    echo    ✅ Socket.IO server is running on port 4001
) else (
    echo    ❌ Socket.IO server is NOT running
)

echo.
echo ============================================
echo   ✅ Services Started with CORS Fix
echo ============================================
echo.
echo 📋 What to do next:
echo.
echo 1. Copy the Socket.IO ngrok URL above
echo.
echo 2. Update Vercel environment variable:
echo    - Go to: https://vercel.com/dashboard
echo    - Your project → Settings → Environment Variables
echo    - Update: NEXT_PUBLIC_SOCKET_URL
echo    - Paste the ngrok URL
echo.
echo    OR use automated script:
echo    node update-vercel-env.mjs
echo.
echo 3. Test on Vercel production:
echo    https://sentra-navy.vercel.app
echo.
echo 4. Open browser DevTools Console, you should see:
echo    ✅ "Connected to Socket.IO server"
echo    ✅ No CORS errors
echo.
echo 5. Check Socket.IO server terminal for:
echo    👤 "Client connected: [socket-id]"
echo.
echo ============================================
echo.

pause
