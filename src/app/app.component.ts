import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PwaUpdateService } from './core/services/pwa-update.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'lams';

  constructor(private pwaUpdateService: PwaUpdateService) {}

  ngOnInit() {
    // Initialize dark mode from localStorage
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const html = document.querySelector('html');
      if (html && localStorage.getItem('darkMode') === '1') {
        html.classList.add('my-app-dark');
      }
    }

    // Initialize PWA update service
    this.initializePwaUpdates();
  }

  /**
   * Initialize PWA update mechanisms
   */
  private initializePwaUpdates() {
    if (typeof window !== 'undefined') {
      console.log('🚀 Initializing PWA updates...');
      this.pwaUpdateService.initPwaPrompt();
    }
  }
}
