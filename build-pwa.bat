@echo off
REM LAMS PWA Build Script for Windows
REM This script builds the PWA with optimizations

echo 🚀 Starting LAMS PWA Build Process...

REM Clean previous builds
echo 🧹 Cleaning previous builds...
if exist dist rmdir /s /q dist

REM Install dependencies if needed
echo 📦 Checking dependencies...
call npm install

REM Build production version
echo 🔨 Building production version...
call ng build --configuration production

REM Check if build was successful
if %errorlevel% equ 0 (
    echo ✅ Build completed successfully!
    
    echo 📊 Build Results:
    echo - Output directory: dist/lams
    echo - Service Worker: Enabled
    echo - PWA Features: Enabled
    
    REM Optional: Start local server for testing
    set /p answer=🌐 Do you want to start local server for testing? (y/n): 
    if /i "%answer:~,1%" equ "y" (
        echo 🌐 Starting local server on port 8080...
        echo Available at:
        echo - Local: http://localhost:8080
        echo - Network: http://192.168.1.17:8080
        echo.
        echo 📱 For PWA testing, use HTTPS (ngrok recommended)
        call npx http-server dist/lams/browser -p 8080 -c-1 --spa --cors
    )
) else (
    echo ❌ Build failed! Check the errors above.
    exit /b 1
)
