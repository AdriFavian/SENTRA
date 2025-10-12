@echo off
REM Production Backend Starter for Windows
REM Runs all backend services needed for Vercel deployment

echo ========================================
echo SENTRA Production Backend Starter
echo ========================================
echo.

echo Starting Node.js backend services...
start "Socket.IO Server" cmd /k "node helpers/socket/socket.js"
timeout /t 2 /nobreak >nul

echo Starting Telegram Bot...
start "Telegram Bot" cmd /k "node telegram-bot.js"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo Backend services started!
echo.
echo Next steps:
echo   1. Start Flask: python app.py
echo   2. Start ngrok: ngrok start --all --config ngrok.yml
echo   3. Update Vercel env vars with ngrok URLs
echo.
echo Press any key to stop all services...
echo ========================================
pause >nul

REM Cleanup - close all windows
taskkill /FI "WindowTitle eq Socket.IO Server*" /F
taskkill /FI "WindowTitle eq Telegram Bot*" /F
