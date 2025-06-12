import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { AuthService } from '../../core/services/auth.service';
import { ImportsModule } from '../../imports';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ImportsModule,
    RouterOutlet,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('expandUp', [
      state(
        'collapsed',
        style({
          height: '0',
          opacity: 0,
          padding: '0 1rem',
          overflow: 'hidden',
        })
      ),
      state('expanded', style({ height: '*', opacity: 1, padding: '1rem' })),
      transition(
        'collapsed <=> expanded',
        animate('200ms cubic-bezier(.4,0,.2,1)')
      ),
    ]),
  ],
})
export class HomeComponent {
  sidebarCollapsed = false;
  isMobile = false;
  profileExpanded = false;
  _auth = inject(AuthService);

  @HostListener('window:resize', [])
  onResize() {
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth <= 768;
      if (!this.isMobile) {
        this.sidebarCollapsed = false; // Reset collapse on desktop
      }
    }
  }

  ngOnInit() {
    this.onResize();
  }

  toggleSidebar() {
    if (this.isMobile) {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    } else {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
  }

  closeSidebar() {
    if (this.isMobile) {
      this.sidebarCollapsed = false;
    }
  }

  toggleProfile() {
    this.profileExpanded = !this.profileExpanded;
  }
}
