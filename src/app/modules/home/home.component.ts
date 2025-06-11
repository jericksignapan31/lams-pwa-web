import { CommonModule } from '@angular/common';
import { Component, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClass } from 'primeng/styleclass';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DrawerModule,
    ButtonModule,
    AvatarModule,
    ButtonModule,
    PanelMenuModule,
    BadgeModule,
    FormsModule,
    InputTextModule,
    AvatarModule,
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
