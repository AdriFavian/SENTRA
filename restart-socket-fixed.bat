@echo off
REM ============================================
REM SENTRA - Restart Socket.IO with CORS Fix
REM ============================================

echo.
echo ============================================
echo   SENTRA - Socket.IO CORS Fix Applied
echo ============================================
echo.

echo [1/3] Stopping existing processes...
taskkill /F /IM ngrok.exe >nul 2>&1
taskkill /F /IM node.exe /FI "WINDOWTITLE eq Socket.IO*" >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/3] Starting ngrok with fixed configuration...
start "ngrok - Socket.IO" cmd /k "ngrok start socket --config ngrok.yml"
timeout /t 5

echo [3/3] Starting Socket.IO server with CORS fix...
start "Socket.IO Server (CORS Fixed)" cmd /k "node helpers/socket/socket.js"
timeout /t 3

echo.
echo ============================================
echo   ✅ Services Started with CORS Fix
echo ============================================
echo.
echo What to do next:
echo.
echo 1. Wait 10 seconds for ngrok to connect
echo 2. Get ngrok URL:
echo    curl http://localhost:4040/api/tunnels
echo.
echo 3. Update Vercel environment variable:
echo    node update-vercel-env.mjs
echo.
echo 4. Test on Vercel production:
echo    https://sentra-navy.vercel.app
echo.
echo 5. Check browser console for:
echo    "✅ Connected to Socket.IO server"
echo.
echo ============================================
echo.

pause
