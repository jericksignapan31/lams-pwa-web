import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { PwaUpdateService } from '../../services/pwa-update.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-pwa-update',
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    BadgeModule,
    TooltipModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="pwa-update-container">
      <p-card header="App Status" styleClass="pwa-status-card">
        <div class="status-content">
          <div class="status-info">
            <div class="status-item">
              <span class="status-label">PWA Status:</span>
              <p-badge 
                [value]="isPwaEnabled ? 'Enabled' : 'Disabled'" 
                [severity]="isPwaEnabled ? 'success' : 'danger'">
              </p-badge>
            </div>
            
            <div class="status-item" *ngIf="isPwaEnabled">
              <span class="status-label">Service Worker:</span>
              <p-badge 
                [value]="swStatus" 
                [severity]="getSwStatusSeverity()">
              </p-badge>
            </div>
            
            <div class="status-item" *ngIf="lastChecked">
              <span class="status-label">Last Checked:</span>
              <span class="status-value">{{ lastChecked | date:'short' }}</span>
            </div>
          </div>

          <div class="action-buttons">
            <button
              pButton
              type="button"
              label="Check for Updates"
              icon="pi pi-refresh"
              (click)="checkForUpdates()"
              [loading]="isChecking"
              class="p-button-primary"
              pTooltip="Check if a new version is available"
              tooltipPosition="top"
            ></button>
            
            <button
              pButton
              type="button"
              label="Force Reload"
              icon="pi pi-sync"
              (click)="forceReload()"
              class="p-button-secondary"
              pTooltip="Force reload the application"
              tooltipPosition="top"
            ></button>
            
            <button
              pButton
              type="button"
              label="App Info"
              icon="pi pi-info-circle"
              (click)="showAppInfo()"
              class="p-button-info p-button-outlined"
              pTooltip="Show application information"
              tooltipPosition="top"
            ></button>
          </div>
        </div>
      </p-card>
    </div>

    <!-- Toast Messages -->
    <p-toast></p-toast>
  `,
  styles: [`
    .pwa-update-container {
      max-width: 500px;
      margin: 1rem 0;
    }

    .status-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .status-info {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .status-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--surface-border);
    }

    .status-item:last-child {
      border-bottom: none;
    }

    .status-label {
      font-weight: 600;
      color: var(--text-color);
    }

    .status-value {
      color: var(--text-color-secondary);
      font-size: 0.9rem;
    }

    .action-buttons {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .action-buttons button {
      flex: 1;
      min-width: 120px;
    }

    :host ::ng-deep .pwa-status-card {
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--surface-border);
    }

    :host ::ng-deep .pwa-status-card .p-card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .action-buttons {
        flex-direction: column;
      }

      .action-buttons button {
        min-width: auto;
      }
    }
  `]
})
export class PwaUpdateComponent implements OnInit {
  isPwaEnabled = false;
  swStatus = 'Unknown';
  lastChecked: Date | null = null;
  isChecking = false;

  constructor(
    private pwaUpdateService: PwaUpdateService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    await this.loadPwaStatus();
  }

  async loadPwaStatus() {
    try {
      const info = await this.pwaUpdateService.getSwRegistrationInfo();
      this.isPwaEnabled = info.enabled;
      
      if (info.enabled && !info.error) {
        this.swStatus = info.state || 'Active';
      } else if (info.error) {
        this.swStatus = 'Error';
      } else {
        this.swStatus = 'Disabled';
      }
    } catch (error) {
      console.error('Error loading PWA status:', error);
      this.swStatus = 'Error';
    }
  }

  async checkForUpdates() {
    this.isChecking = true;
    this.lastChecked = new Date();

    try {
      const hasUpdate = await this.pwaUpdateService.checkForAppUpdates();
      
      if (hasUpdate) {
        this.messageService.add({
          severity: 'info',
          summary: 'Update Available',
          detail: 'A new version is available! You will be prompted to update.',
          life: 5000
        });
      } else {
        this.messageService.add({
          severity: 'success',
          summary: 'Up to Date',
          detail: 'You are running the latest version of LAMS.',
          life: 3000
        });
      }
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Update Check Failed',
        detail: 'Unable to check for updates. Please try again.',
        life: 5000
      });
    } finally {
      this.isChecking = false;
    }
  }

  forceReload() {
    if (confirm('This will reload the application. Any unsaved changes will be lost. Continue?')) {
      this.pwaUpdateService.forceReload();
    }
  }

  showAppInfo() {
    const info = `
🔧 LAMS - Laboratory Asset Management System

📱 PWA Status: ${this.isPwaEnabled ? 'Enabled' : 'Disabled'}
⚙️ Service Worker: ${this.swStatus}
🔄 Last Update Check: ${this.lastChecked ? this.lastChecked.toLocaleString() : 'Never'}

🌐 User Agent: ${navigator.userAgent.substring(0, 100)}...
📍 URL: ${window.location.href}
    `;

    alert(info);
  }

  getSwStatusSeverity(): 'success' | 'info' | 'warn' | 'danger' {
    switch (this.swStatus.toLowerCase()) {
      case 'active':
      case 'activated':
        return 'success';
      case 'installing':
      case 'waiting':
        return 'info';
      case 'redundant':
        return 'warn';
      case 'error':
      case 'disabled':
        return 'danger';
      default:
        return 'info';
    }
  }
}
