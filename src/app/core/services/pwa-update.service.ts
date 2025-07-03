import { Injectable, ApplicationRef } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, map } from 'rxjs/operators';
import { concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PwaUpdateService {

  constructor(
    private appRef: ApplicationRef,
    private swUpdate: SwUpdate
  ) {}

  /**
   * Initialize PWA update mechanisms
   */
  initPwaPrompt() {
    console.log('🔄 PWA Update Service initialized');
    
    if (!this.swUpdate.isEnabled) {
      console.log('⚠️ Service Worker not enabled');
      return;
    }

    // Check for updates periodically
    this.checkForAppUpdates();
    
    // Listen for version updates
    this.listenForVersionUpdates();
    
    // Check for updates when app stabilizes
    this.checkForUpdatesOnStable();
  }

  /**
   * Manually check for application updates
   */
  async checkForAppUpdates(): Promise<boolean> {
    console.log('🔍 Checking for app updates...');
    
    if (!this.swUpdate.isEnabled) {
      console.log('⚠️ Service Worker updates not available');
      return false;
    }

    try {
      const updateAvailable = await this.swUpdate.checkForUpdate();
      console.log(updateAvailable ? '✅ Update available!' : '✅ App is up to date');
      return updateAvailable;
    } catch (error) {
      console.error('❌ Error checking for updates:', error);
      return false;
    }
  }

  /**
   * Listen for version ready events (new version downloaded)
   */
  private listenForVersionUpdates() {
    this.swUpdate.versionUpdates
      .pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')
      )
      .subscribe(event => {
        console.log('📦 New version ready:', event.latestVersion);
        this.showUpdatePrompt(event);
      });
  }

  /**
   * Show update prompt to user
   */
  private showUpdatePrompt(event: VersionReadyEvent) {
    const updateMessage = `
      🔄 A new version of LAMS is available!
      
      Current version: ${event.currentVersion.hash.substring(0, 8)}
      New version: ${event.latestVersion.hash.substring(0, 8)}
      
      Would you like to update now?
    `;

    if (confirm(updateMessage)) {
      this.activateUpdate();
    } else {
      console.log('ℹ️ User declined update');
      // Store that user declined, maybe show banner
      this.showUpdateBanner();
    }
  }

  /**
   * Activate the pending update
   */
  async activateUpdate(): Promise<void> {
    console.log('🔄 Activating update...');
    
    try {
      await this.swUpdate.activateUpdate();
      console.log('✅ Update activated successfully');
      
      // Show loading message
      this.showUpdateInProgress();
      
      // Reload the page to apply updates
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error activating update:', error);
      alert('Update failed. Please refresh the page manually.');
    }
  }

  /**
   * Check for updates when app becomes stable
   */
  private checkForUpdatesOnStable() {
    // Allow the app to stabilize first, then check for updates
    const appIsStable$ = this.appRef.isStable.pipe(
      first(isStable => isStable === true)
    );
    
    const everySixHours$ = interval(6 * 60 * 60 * 1000); // Check every 6 hours
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);

    everySixHoursOnceAppIsStable$.subscribe(async () => {
      try {
        console.log('⏰ Periodic update check...');
        await this.checkForAppUpdates();
      } catch (err) {
        console.error('❌ Periodic update check failed:', err);
      }
    });
  }

  /**
   * Show update banner for declined updates
   */
  private showUpdateBanner() {
    // Create update banner element
    const banner = document.createElement('div');
    banner.id = 'pwa-update-banner';
    banner.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px 20px;
        text-align: center;
        z-index: 9999;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
      ">
        <span>🔄 A new version is available!</span>
        <button onclick="this.parentElement.parentElement.remove(); window.pwaUpdateService.activateUpdate();" style="
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 6px 12px;
          border-radius: 15px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.3s ease;
        " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
          Update Now
        </button>
        <button onclick="this.parentElement.parentElement.remove();" style="
          background: transparent;
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 6px 12px;
          border-radius: 15px;
          cursor: pointer;
          font-size: 12px;
        ">
          Later
        </button>
      </div>
    `;

    // Remove existing banner if present
    const existingBanner = document.getElementById('pwa-update-banner');
    if (existingBanner) {
      existingBanner.remove();
    }

    // Add banner to page
    document.body.appendChild(banner);

    // Make service available globally for banner buttons
    (window as any).pwaUpdateService = this;

    // Auto-hide banner after 10 seconds
    setTimeout(() => {
      if (document.getElementById('pwa-update-banner')) {
        banner.remove();
      }
    }, 10000);
  }

  /**
   * Show update in progress message
   */
  private showUpdateInProgress() {
    const loader = document.createElement('div');
    loader.id = 'pwa-update-loader';
    loader.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="text-align: center;">
          <div style="
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          "></div>
          <h2 style="margin: 0 0 10px 0;">Updating LAMS...</h2>
          <p style="margin: 0; opacity: 0.8;">Please wait while we update the application</p>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;

    document.body.appendChild(loader);
  }

  /**
   * Force reload to get latest version (emergency method)
   */
  forceReload() {
    console.log('🔄 Force reloading application...');
    window.location.reload();
  }

  /**
   * Get service worker registration info
   */
  async getSwRegistrationInfo() {
    if (!this.swUpdate.isEnabled) {
      return { enabled: false };
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      return {
        enabled: true,
        registration: registration,
        hasUpdate: !!(registration?.waiting),
        state: registration?.active?.state
      };
    } catch (error) {
      console.error('Error getting SW registration:', error);
      return { enabled: true, error: error };
    }
  }
}
