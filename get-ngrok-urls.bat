@echo off
echo ============================================
echo    SENTRA - Get ngrok URLs
echo ============================================
echo.

REM Check if ngrok is running
curl -s http://localhost:4040/api/tunnels > nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: ngrok is not running!
    echo.
    echo Please start ngrok first:
    echo   ngrok start --all --config ngrok.yml
    echo.
    echo Or run: start-production.bat
    echo.
    pause
    exit /b 1
)

echo Fetching ngrok tunnel URLs...
echo.

REM Get tunnels using PowerShell
powershell -Command "$response = Invoke-WebRequest -Uri 'http://localhost:4040/api/tunnels' -UseBasicParsing; $tunnels = ($response.Content | ConvertFrom-Json).tunnels; Write-Host ''; Write-Host '============================================' -ForegroundColor Green; Write-Host '   ngrok Tunnel URLs' -ForegroundColor Green; Write-Host '============================================' -ForegroundColor Green; Write-Host ''; foreach ($tunnel in $tunnels) { $name = $tunnel.name; $url = $tunnel.public_url; if ($name -eq 'flask') { Write-Host 'FLASK URL:' -ForegroundColor Yellow; Write-Host $url -ForegroundColor Cyan; Write-Host ''; } elseif ($name -eq 'socket') { Write-Host 'SOCKET URL:' -ForegroundColor Yellow; Write-Host $url -ForegroundColor Cyan; Write-Host ''; } }; Write-Host '============================================' -ForegroundColor Green; Write-Host ''; Write-Host 'NEXT STEPS:' -ForegroundColor Yellow; Write-Host '1. Copy the URLs above'; Write-Host '2. Go to: https://vercel.com/dashboard'; Write-Host '3. Select project: sentra-navy'; Write-Host '4. Settings -> Environment Variables'; Write-Host '5. Update:'; Write-Host '   - NEXT_PUBLIC_SOCKET_URL = SOCKET URL'; Write-Host '   - NEXT_PUBLIC_FLASK_URL = FLASK URL'; Write-Host '   - NGROK_URL = FLASK URL'; Write-Host '6. Deployments -> Redeploy'; Write-Host ''; Write-Host 'OR use automated script:'; Write-Host '   npm run update-vercel-env'; Write-Host '';"

echo.
echo ============================================
echo.
pause
