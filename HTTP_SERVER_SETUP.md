# HTTP Server Setup Guide para sa LAMS PWA

## 🚨 Problem: "Index of" Page Instead of App

### ❌ **Wrong Command (Nagkakaproblema):**

```bash
npx http-server -p 8080 -c-1 dist/lams/browser --spa
```

### ✅ **Correct Commands:**

#### **Option 1: http-server with SPA flag**

```bash
npx http-server dist/lams/browser -p 8080 -c-1 --spa --cors
```

#### **Option 2: serve package (Recommended)**

```bash
npx serve dist/lams/browser -s -p 8080
```

#### **Option 3: Angular's built-in serve**

```bash
ng serve --configuration production
```

## 🔧 **Why "Index of" Appears:**

1. **Wrong directory**: Pointing to `dist/lams` instead of `dist/lams/browser`
2. **Missing --spa flag**: SPA needs fallback to index.html
3. **Wrong order**: Flags should come after directory path

## 📱 **Complete Setup Steps:**

### **Step 1: Build the App**

```bash
ng build --configuration production
```

### **Step 2: Serve with Correct Command**

```bash
# Method 1: Using http-server
npx http-server dist/lams/browser -p 8080 -c-1 --spa --cors

# Method 2: Using serve (simpler)
npx serve dist/lams/browser -s -p 8080
```

### **Step 3: Access the App**

- **Local**: http://localhost:8080
- **Network**: http://192.168.1.17:8080
- **For PWA testing**: Use HTTPS (see HTTPS section below)

## 🌐 **Directory Structure After Build:**

```
dist/
└── lams/
    └── browser/          ← Serve this directory
        ├── index.html
        ├── main.js
        ├── styles.css
        └── assets/
```

## 🔒 **HTTPS for PWA Testing:**

PWA features require HTTPS. Use these options:

### **Option 1: ngrok (Recommended)**

```bash
# Install ngrok
npm install -g ngrok

# Start your server
npx serve dist/lams/browser -s -p 8080

# In another terminal
ngrok http 8080
```

### **Option 2: local-web-server with HTTPS**

```bash
npm install -g local-web-server
ws -p 8080 -d dist/lams/browser --spa --https
```

### **Option 3: Angular serve with HTTPS**

```bash
ng serve --ssl --host 0.0.0.0 --port 8080
```

## 🚀 **Quick Fix Script:**

Create `serve-pwa.bat`:

```bat
@echo off
echo 🚀 Starting LAMS PWA Server...

if not exist dist\lams\browser (
    echo ❌ Built files not found. Building first...
    call ng build --configuration production
)

echo 🌐 Starting server on port 8080...
echo Available at:
echo - Local: http://localhost:8080
echo - Network: http://192.168.1.17:8080
echo.
echo 📱 For PWA features, use HTTPS (ngrok recommended)
echo.

npx serve dist/lams/browser -s -p 8080
```

## 🔍 **Troubleshooting:**

### **Problem: Still getting "Index of"**

**Solution:**

1. Check if `dist/lams/browser/index.html` exists
2. Use `--spa` flag for SPA routing
3. Make sure serving the correct directory

### **Problem: PWA not working**

**Solution:**

1. Use HTTPS (ngrok or similar)
2. Check if service worker is registered
3. Verify manifest.webmanifest is accessible

### **Problem: Routes return 404**

**Solution:**

1. Use `--spa` flag
2. Ensure `index.html` exists in served directory
3. Check Angular routing configuration

## 📋 **Command Comparison:**

| Command       | Purpose             | Pros                  | Cons                  |
| ------------- | ------------------- | --------------------- | --------------------- |
| `http-server` | Basic static server | Simple                | Needs --spa flag      |
| `serve`       | SPA-optimized       | Works out of box      | Requires installation |
| `ng serve`    | Development server  | Full Angular features | Slower, dev mode      |
| `ngrok`       | HTTPS tunneling     | Real PWA testing      | Requires account      |

## 💡 **Best Practice:**

```bash
# Development
ng serve

# Production testing (HTTP)
npx serve dist/lams/browser -s -p 8080

# PWA testing (HTTPS)
npx serve dist/lams/browser -s -p 8080 & ngrok http 8080
```
