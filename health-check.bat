@echo off
REM ============================================
REM SENTRA System Health Check
REM ============================================

echo.
echo ============================================
echo   SENTRA - System Health Check
echo ============================================
echo.

REM Check ngrok
echo [1/6] Checking ngrok...
curl -s http://localhost:4040/api/tunnels >nul 2>&1
if %errorlevel%==0 (
    echo   ✅ ngrok: RUNNING
    echo.
    echo   Tunnel URLs:
    powershell -Command "$tunnels = (Invoke-RestMethod http://localhost:4040/api/tunnels).tunnels; foreach($t in $tunnels) { Write-Host ('     ' + $t.name + ': ' + $t.public_url) }"
) else (
    echo   ❌ ngrok: NOT RUNNING
    echo   Fix: ngrok start --all --config ngrok.yml
)
echo.

REM Check Socket.IO
echo [2/6] Checking Socket.IO Server...
curl -s http://localhost:4001 >nul 2>&1
if %errorlevel%==0 (
    echo   ✅ Socket.IO: RUNNING on port 4001
) else (
    echo   ❌ Socket.IO: NOT RUNNING
    echo   Fix: node helpers/socket/socket.js
)
echo.

REM Check Flask
echo [3/6] Checking Flask Backend...
curl -s http://localhost:5000 >nul 2>&1
if %errorlevel%==0 (
    echo   ✅ Flask: RUNNING on port 5000
) else (
    echo   ❌ Flask: NOT RUNNING
    echo   Fix: python app.py
)
echo.

REM Check Node.js
echo [4/6] Checking Node.js...
node --version >nul 2>&1
if %errorlevel%==0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo   ✅ Node.js: INSTALLED %NODE_VERSION%
) else (
    echo   ❌ Node.js: NOT INSTALLED
    echo   Fix: Download from https://nodejs.org
)
echo.

REM Check Python
echo [5/6] Checking Python...
python --version >nul 2>&1
if %errorlevel%==0 (
    for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
    echo   ✅ Python: INSTALLED %PYTHON_VERSION%
) else (
    echo   ❌ Python: NOT INSTALLED
    echo   Fix: Download from https://python.org
)
echo.

REM Check Vercel CLI
echo [6/6] Checking Vercel CLI...
vercel --version >nul 2>&1
if %errorlevel%==0 (
    for /f "tokens=*" %%i in ('vercel --version') do set VERCEL_VERSION=%%i
    echo   ✅ Vercel CLI: INSTALLED %VERCEL_VERSION%
) else (
    echo   ❌ Vercel CLI: NOT INSTALLED
    echo   Fix: npm i -g vercel
)
echo.

echo ============================================
echo   Health Check Complete
echo ============================================
echo.
echo Quick Actions:
echo   1. View ngrok dashboard: http://localhost:4040
echo   2. Update Vercel env: node update-vercel-env.js
echo   3. Start all services: .\start-all-backend.bat
echo.
pause
