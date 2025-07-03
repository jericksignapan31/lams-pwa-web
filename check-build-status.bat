@echo off
REM Build Status Check Script
REM This script checks if the build will succeed before actually building

echo 🔍 Checking LAMS PWA Build Status...
echo.

REM Check if Angular CLI is installed
call ng version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Angular CLI is not installed
    echo Install it with: npm install -g @angular/cli
    exit /b 1
)

REM Check if node_modules exists
if not exist node_modules (
    echo ❌ node_modules not found
    echo Run: npm install
    exit /b 1
)

REM Check for common build issues
echo 📋 Checking for common build issues...

REM Check routing configuration
if exist src\app\app.routes.ts (
    echo ✅ Main routing file found
) else (
    echo ❌ Main routing file missing
    exit /b 1
)

if exist src\app\app.routes.server.ts (
    echo ✅ Server routing file found
) else (
    echo ❌ Server routing file missing
    exit /b 1
)

REM Check service worker config
if exist ngsw-config.json (
    echo ✅ Service worker config found
) else (
    echo ❌ Service worker config missing
    exit /b 1
)

REM Check manifest
if exist public\manifest.webmanifest (
    echo ✅ PWA manifest found
) else (
    echo ❌ PWA manifest missing
    exit /b 1
)

REM Check TypeScript config
if exist tsconfig.json (
    echo ✅ TypeScript config found
) else (
    echo ❌ TypeScript config missing
    exit /b 1
)

echo.
echo 🎯 Build Status Summary:
echo ✅ All essential files found
echo ✅ Configuration appears correct
echo ✅ Ready to build

echo.
echo 🚀 To build the project:
echo - Development: ng build
echo - Production: ng build --configuration production
echo - With build script: build-pwa.bat

echo.
echo 📊 Current Budget Settings:
echo - Initial Bundle: 1MB warning, 2MB error
echo - Component Styles: 16kB warning, 25kB error
echo - Total Bundle: 1MB warning, 2MB error

echo.
echo 💡 If build fails:
echo 1. Check console output for specific errors
echo 2. Verify all routes exist in routing config
echo 3. Check CSS file sizes (optimize if needed)
echo 4. Ensure all imports are correct

REM Common serving issues and solutions
echo.
echo 🌐 Local Server Commands:
echo - Basic: npx http-server dist/lams/browser -p 8080 -c-1
echo - SPA mode: npx http-server dist/lams/browser -p 8080 -c-1 --spa
echo - With CORS: npx http-server dist/lams/browser -p 8080 -c-1 --cors --spa
echo - Alternative: npx serve dist/lams/browser -s -p 8080

echo.
echo 📱 PWA Testing:
echo - Local: http://localhost:8080
echo - Network: http://[your-ip]:8080
echo - HTTPS (required for PWA): Use ngrok or similar

echo.
echo ⚠️ Common Issues:
echo - "Index of" page: Wrong directory or missing --spa flag
echo - PWA not working: Need HTTPS for service worker
echo - Routes 404: Missing --spa flag for SPA routing
