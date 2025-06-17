import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { AuthService } from '../../core/services/auth.service';
import { ImportsModule } from '../../imports';
import { UserService } from '../../modules/usermanagement/services/user.service';
import { campuses as campusesData } from './models/data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ImportsModule,
    RouterOutlet,
    PanelMenuModule,
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
  user: any;
  isDarkMode = false;
  _auth = inject(AuthService);
  userService = inject(UserService);

  inventoryOpen = false;
  campuses = campusesData.map((campus) => ({
    ...campus,
    open: false,
    departments: campus.departments.map((dept) => ({ ...dept, open: false })),
  }));

  panelMenuItems = [
    {
      label: 'Inventory',
      icon: 'pi pi-warehouse',
      items: this.campuses.map((campus) => ({
        label: campus.name,
        icon: 'pi pi-building',
        items: campus.departments.map((dept) => ({
          label: dept.name,
          icon: 'pi pi-building-columns',
          items: dept.rooms.map((room) => ({
            label: room,
            icon: 'pi pi-home',
          })),
        })),
      })),
    },
  ];

  dashboardMenuItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-objects-column',
      items: [
        {
          label: 'Analytics',
          icon: 'pi pi-chart-bar',
          routerLink: '/home/dashboard',
        },
        {
          label: 'Reports',
          icon: 'pi pi-file',
          routerLink: '/home/reports',
        },
      ],
    },
  ];

  @HostListener('window:resize', [])
  onResize() {
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth <= 768;
      if (!this.isMobile) {
        this.sidebarCollapsed = false; // Reset collapse on desktop
      }
    }
  }

  toggleDarkMode() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const html = document.querySelector('html');
      if (html) {
        html.classList.toggle('my-app-dark');
        this.isDarkMode = html.classList.contains('my-app-dark');
        localStorage.setItem('darkMode', this.isDarkMode ? '1' : '0');
      }
    }
  }

  ngOnInit() {
    this.onResize();

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const html = document.querySelector('html');
      if (html && localStorage.getItem('darkMode') === '1') {
        html.classList.add('my-app-dark');
        this.isDarkMode = true;
      } else {
        this.isDarkMode = false;
      }
    }

    this.userService.getUser().subscribe((profile: any) => {
      this.user = profile;
    });
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

  toggleInventory() {
    this.inventoryOpen = !this.inventoryOpen;
  }
  toggleCampus(campus: any) {
    campus.open = !campus.open;
  }
  toggleDepartment(dept: any) {
    dept.open = !dept.open;
  }
}
