@echo off
REM Serve PWA Script - Fixed version
REM This script properly serves the LAMS PWA

echo 🚀 Starting LAMS PWA Server (Fixed)...
echo.

REM Check if built files exist
if not exist dist\lams\browser (
    echo ❌ Built files not found. Building first...
    call ng build --configuration production
    echo.
)

if not exist dist\lams\browser\index.html (
    echo ❌ index.html not found in dist/lams/browser
    echo Please run: ng build --configuration production
    exit /b 1
)

echo ✅ Built files found
echo.

echo 🌐 Starting server on port 8080...
echo Available at:
echo - Local: http://localhost:8080
echo - Network: http://192.168.1.17:8080
echo.
echo 📱 For PWA features, use HTTPS:
echo - Install ngrok: npm install -g ngrok
echo - Run: ngrok http 8080
echo.
echo 🔧 Using correct command for SPA:
echo npx serve dist/lams/browser -s -p 8080
echo.

REM Use serve package which handles SPA better
npx serve dist/lams/browser -s -p 8080
