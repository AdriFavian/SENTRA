@echo off
REM Simple deployment script for Vercel (Windows)

echo ============================================
echo    Deploying SENTRA to Vercel
echo ============================================
echo.

REM Deploy to production
vercel --prod --confirm

echo.
echo ============================================
echo    Deployment Complete!
echo ============================================
echo.
echo Next steps:
echo 1. Go to https://vercel.com/dashboard
echo 2. Find your project (sentra)
echo 3. Go to Storage - Create Database - Postgres
echo 4. Go to Settings - Environment Variables
echo 5. Add your environment variables
echo 6. Redeploy from dashboard
echo.
pause
