# PWA Update Guide para sa LAMS Project

## 📱 Paano Mag-Update ng Service Workers at PWA

### 1. **Automatic Updates (Naka-setup na sa project)**

Ang inyong LAMS PWA ay may automatic update system na:

#### ✅ **Ginagawa nito:**
- **Automatic checking** ng updates tuwing mag-open ng app
- **Periodic checks** every 6 hours pag bukas ang app
- **Notifies users** kapag may bagong version
- **Shows update prompts** with option to update now or later
- **Smooth update experience** with loading indicators

#### 🔧 **Kung saan naka-configure:**
- `src/app/core/services/pwa-update.service.ts` - Main update service
- `src/app/app.component.ts` - Initializes updates on app start
- `ngsw-config.json` - Service worker configuration

### 2. **Manual na Pag-update ng Service Worker**

#### **Para sa Development:**
```bash
# Build ng production version
ng build --prod

# I-serve ang built files
ng serve --prod
```

#### **Para sa Production Deployment:**
```bash
# Build the app
ng build --prod

# Deploy sa server (example commands)
# Para sa Firebase:
firebase deploy

# Para sa Netlify:
# Upload dist folder

# Para sa regular web server:
# Copy dist/ contents to web server
```

### 3. **Mga Paraan ng Pag-update**

#### **A. Automatic Updates (Recommended)**
- Walang kailangan gawin
- Mag-aantay lang ng update prompt
- Click "Update Now" kapag lumabas

#### **B. Manual Update Check**
Sa browser console, pwede mong i-type:
```javascript
// Check for updates manually
window.pwaUpdateService.checkForAppUpdates();

// Force reload
window.pwaUpdateService.forceReload();
```

#### **C. Hard Refresh**
- Press `Ctrl + Shift + R` (Windows/Linux)
- O `Cmd + Shift + R` (Mac)
- O i-clear ang cache sa browser settings

### 4. **PWA Update Component Usage**

May separate component para sa manual updates:

```typescript
// Sa component na gusto mo ilagay ang update controls
import { PwaUpdateComponent } from './core/components/pwa-update/pwa-update.component';

// Sa template:
<app-pwa-update></app-pwa-update>
```

### 5. **Mga Update Triggers**

#### **Automatic triggers:**
- App startup
- Every 6 hours
- When network comes back online
- When app becomes stable

#### **Manual triggers:**
- User clicks "Check for Updates"
- Developer calls `checkForAppUpdates()`
- Page refresh with cache clear

### 6. **Update Flow**

```
1. App checks for updates
2. If update available:
   - Download new version in background
   - Show update prompt to user
3. User chooses:
   - "Update Now" → Activate update + reload
   - "Later" → Show update banner
4. Update applied successfully
```

### 7. **Configuration Files**

#### **ngsw-config.json** - Service Worker Config
```json
{
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "updateMode": "prefetch"
    }
  ],
  "dataGroups": [
    {
      "name": "api-cache",
      "urls": ["/api/**"],
      "cacheConfig": {
        "strategy": "freshness",
        "maxAge": "1h"
      }
    }
  ]
}
```

#### **app.config.ts** - Service Worker Provider
```typescript
provideServiceWorker('ngsw-worker.js', {
  enabled: !isDevMode(),
  registrationStrategy: 'registerWhenStable:30000'
})
```

### 8. **Troubleshooting**

#### **Problema: Hindi nag-aupdate ang app**
**Solution:**
1. Clear browser cache
2. Unregister service worker:
   ```javascript
   navigator.serviceWorker.getRegistrations().then(function(registrations) {
     for(let registration of registrations) {
       registration.unregister();
     }
   });
   ```
3. Hard refresh (`Ctrl + Shift + R`)

#### **Problema: Stuck sa old version**
**Solution:**
1. Open browser DevTools
2. Go to Application tab
3. Click "Service Workers"
4. Click "Update" o "Unregister"
5. Refresh page

#### **Problema: Update notification hindi lumalabas**
**Solution:**
1. Check browser console for errors
2. Verify service worker is registered
3. Check if running in HTTPS (required for PWA)

### 9. **Best Practices**

#### **Para sa Users:**
- Always click "Update Now" when prompted
- Don't ignore update notifications
- Use latest browser version
- Enable notifications for better UX

#### **Para sa Developers:**
- Test updates in staging environment
- Monitor update success rates
- Keep service worker config updated
- Version your API properly

### 10. **Browser Support**

#### **Supported Browsers:**
- ✅ Chrome 45+
- ✅ Firefox 44+
- ✅ Safari 11.1+
- ✅ Edge 17+
- ✅ Mobile browsers

#### **Required Features:**
- Service Worker support
- HTTPS connection
- JavaScript enabled

### 11. **Monitoring Updates**

#### **Console Logs:**
```
🔄 PWA Update Service initialized
🔍 Checking for app updates...
✅ Update available!
📦 New version ready
🔄 Activating update...
✅ Update activated successfully
```

#### **User Notifications:**
- Update prompts with version info
- Update banners for declined updates
- Loading screens during updates
- Success/error messages

### 12. **Version Management**

#### **Automatic Version Detection:**
- Angular automatically generates version hashes
- Service worker compares versions
- Only updates when content changes

#### **Manual Version Control:**
- Update `package.json` version
- Update `manifest.webmanifest` version
- Deploy new build

---

## 🚀 Quick Commands

### Check PWA Status
```bash
# Open browser DevTools
# Go to Application > Service Workers
# Check registration status
```

### Force Update
```javascript
// In browser console
window.location.reload(true);
```

### Clear All Cache
```javascript
// In browser console
caches.keys().then(names => {
  names.forEach(name => {
    caches.delete(name);
  });
});
```

---

## 📱 Mobile App-like Experience

Ang LAMS PWA ay may:
- **Offline capability** - Works kahit walang internet
- **Push notifications** - For updates and alerts
- **Install prompt** - Add to home screen
- **Full-screen mode** - App-like experience
- **Background sync** - Sync data when online

---

## 🔧 Development Tips

1. **Always test updates** sa staging environment
2. **Use HTTPS** para sa service worker
3. **Monitor update success** rates
4. **Keep cache strategies** updated
5. **Test offline functionality** regularly

---

## 🔧 Build Issues & Solutions

### **Bundle Size Warnings**
Kung makakakuha ng budget exceeded warnings:

#### **Solution 1: Update Angular Budget**
```json
// Sa angular.json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "1MB",
    "maximumError": "2MB"
  },
  {
    "type": "anyComponentStyle",
    "maximumWarning": "10kB",
    "maximumError": "20kB"
  }
]
```

#### **Solution 2: Optimize CSS Files**
- Remove unused styles
- Combine similar classes
- Use CSS variables
- Extract common styles to global CSS

### **Prerendering Route Errors**
Kung may route parameters na walang `getPrerenderParams`:

#### **Solution: Update app.routes.server.ts**
```typescript
// Routes with parameters - use Client rendering
{
  path: 'home/schedules/:laboratoryId/:roomName',
  renderMode: RenderMode.Client
}

// Static routes - use Prerender
{
  path: 'home/dashboard',
  renderMode: RenderMode.Prerender
}
```

### **CommonJS Dependencies**
Kung may warning about CommonJS modules:

#### **Solution: Add to angular.json**
```json
"allowedCommonJsDependencies": [
  "quill",
  "quill-delta",
  "lodash",
  "moment"
]
```

### **Build Commands**
```bash
# Development build
ng build

# Production build
ng build --prod

# Build with specific environment
ng build --configuration production

# Build and serve locally
ng build --prod && npx http-server dist/lams -p 8080
```

---

### **Quick Build Fix Commands**

```bash
# Check build status first
check-build-status.bat

# Fix common issues
ng build --configuration production --verbose

# If CSS budget issues:
# Option 1: Increase budgets (already done)
# Option 2: Optimize CSS files (see equipment.component.optimized.scss)

# If routing issues:
# Make sure all routes in app.routes.server.ts match app.routes.ts

# Common fixes:
# 1. Route mismatch: 'auth/login' → 'login'
# 2. CSS too large: Use optimized versions
# 3. CommonJS deps: Add to allowedCommonJsDependencies
```

### **Build Error Solutions**

#### **"Route does not match any routes"**
```typescript
// Fix: Update app.routes.server.ts to match app.routes.ts
// Wrong:
{ path: 'auth/login', renderMode: RenderMode.Prerender }

// Correct:
{ path: 'login', renderMode: RenderMode.Prerender }
```

#### **"CSS exceeded maximum budget"**
```json
// Fix: Increase budgets in angular.json
{
  "type": "anyComponentStyle",
  "maximumWarning": "15kB",
  "maximumError": "25kB"
}
```

#### **"CommonJS dependencies"**
```json
// Fix: Add to angular.json
"allowedCommonJsDependencies": [
  "quill", "quill-delta", "lodash", "moment"
]
```

---

**Need help?** Check ang browser console para sa debug info o i-contact ang development team.
