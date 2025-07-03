// PWA Development Helper Script
// Run this in browser console for PWA debugging

console.log("🔧 PWA Development Helper Loaded");

// Global PWA utilities
window.pwaDebug = {
  
  // Check service worker status
  async checkServiceWorker() {
    console.log("🔍 Checking Service Worker status...");
    
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          console.log("✅ Service Worker registered:");
          console.log("- Scope:", registration.scope);
          console.log("- State:", registration.active?.state);
          console.log("- Update available:", !!registration.waiting);
          return registration;
        } else {
          console.log("❌ No Service Worker registration found");
          return null;
        }
      } catch (error) {
        console.error("❌ Error checking Service Worker:", error);
        return null;
      }
    } else {
      console.log("❌ Service Worker not supported");
      return null;
    }
  },

  // Force update service worker
  async forceUpdate() {
    console.log("🔄 Forcing Service Worker update...");
    
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        console.log("✅ Service Worker update triggered");
        
        // If there's a waiting worker, skip waiting
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          console.log("⏭️ Skipping waiting, activating new version");
        }
      } else {
        console.log("❌ No Service Worker to update");
      }
    } catch (error) {
      console.error("❌ Error updating Service Worker:", error);
    }
  },

  // Clear all caches
  async clearAllCaches() {
    console.log("🧹 Clearing all caches...");
    
    try {
      const cacheNames = await caches.keys();
      console.log("📦 Found caches:", cacheNames);
      
      const deletePromises = cacheNames.map(name => caches.delete(name));
      await Promise.all(deletePromises);
      
      console.log("✅ All caches cleared");
    } catch (error) {
      console.error("❌ Error clearing caches:", error);
    }
  },

  // Unregister service worker
  async unregisterServiceWorker() {
    console.log("🗑️ Unregistering Service Worker...");
    
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      for (const registration of registrations) {
        await registration.unregister();
        console.log("✅ Service Worker unregistered:", registration.scope);
      }
      
      if (registrations.length === 0) {
        console.log("ℹ️ No Service Workers to unregister");
      }
    } catch (error) {
      console.error("❌ Error unregistering Service Worker:", error);
    }
  },

  // Check PWA installation status
  checkPWAInstallation() {
    console.log("📱 Checking PWA installation...");
    
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    console.log("- Standalone mode:", isStandalone);
    console.log("- iOS device:", isIOS);
    console.log("- Android device:", isAndroid);
    console.log("- User agent:", navigator.userAgent);
    
    if (isStandalone) {
      console.log("✅ PWA is installed and running in standalone mode");
    } else {
      console.log("ℹ️ PWA is running in browser mode");
    }
  },

  // Test offline functionality
  testOfflineMode() {
    console.log("📡 Testing offline mode...");
    
    // Simulate offline
    if ('serviceWorker' in navigator && navigator.onLine) {
      console.log("🔌 Currently online, you can test offline by:");
      console.log("1. Open DevTools → Network tab");
      console.log("2. Check 'Offline' checkbox");
      console.log("3. Refresh the page");
      console.log("4. PWA should work offline with cached content");
    } else if (!navigator.onLine) {
      console.log("📡 Currently offline - PWA should serve cached content");
    } else {
      console.log("❌ Service Worker not available for offline testing");
    }
  },

  // Show cache contents
  async showCacheContents() {
    console.log("📦 Showing cache contents...");
    
    try {
      const cacheNames = await caches.keys();
      
      for (const cacheName of cacheNames) {
        console.log(`\n📁 Cache: ${cacheName}`);
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        
        requests.forEach(request => {
          console.log(`  - ${request.url}`);
        });
      }
    } catch (error) {
      console.error("❌ Error reading cache contents:", error);
    }
  },

  // Reset PWA completely
  async resetPWA() {
    console.log("🔄 Resetting PWA completely...");
    
    try {
      // Clear all caches
      await this.clearAllCaches();
      
      // Unregister service workers
      await this.unregisterServiceWorker();
      
      // Clear localStorage
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      console.log("✅ PWA reset complete");
      console.log("🔄 Please refresh the page to start fresh");
      
    } catch (error) {
      console.error("❌ Error resetting PWA:", error);
    }
  },

  // Show help
  showHelp() {
    console.log(`
🔧 PWA Debug Helper Commands:

📋 Available Commands:
- pwaDebug.checkServiceWorker()     - Check SW status
- pwaDebug.forceUpdate()            - Force SW update
- pwaDebug.clearAllCaches()         - Clear all caches
- pwaDebug.unregisterServiceWorker() - Unregister SW
- pwaDebug.checkPWAInstallation()   - Check PWA install status
- pwaDebug.testOfflineMode()        - Test offline functionality
- pwaDebug.showCacheContents()      - Show cached files
- pwaDebug.resetPWA()               - Reset everything
- pwaDebug.showHelp()               - Show this help

🚀 Quick Commands:
- pwaDebug.checkServiceWorker()     - Most common debug command
- pwaDebug.resetPWA()               - When everything breaks

💡 Pro Tips:
- Use DevTools → Application → Service Workers for visual debugging
- Check DevTools → Application → Cache Storage for cache contents
- Monitor DevTools → Console for PWA logs
- Test offline mode in DevTools → Network tab
    `);
  }
};

// Auto-run basic checks
console.log("🎯 Auto-running basic PWA checks...");
pwaDebug.checkServiceWorker();
pwaDebug.checkPWAInstallation();

console.log("\n💡 Type 'pwaDebug.showHelp()' for available commands");
