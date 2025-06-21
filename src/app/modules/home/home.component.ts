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
import { LaboratoryService } from '../laboratory/services/laboratory.service';
import {
  campuses as campusesData,
  getPanelMenuItems,
  dashboardMenuItems,
  laboratoryPanelMenuModel,
  campusPanelMenu,
  schoolManagementPanelMenu,
} from './models/sidebar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ImportsModule, RouterOutlet],
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
  inventoryOpen = false;
  drawerVisible = false;

  campuses = campusesData.map((campus) => ({
    ...campus,
    open: false,
    departments: campus.departments.map((dept) => ({ ...dept, open: false })),
  }));

  panelMenuItems: any[] = [];
  dashboardMenuItems = dashboardMenuItems;
  laboratoryPanelMenuModel = laboratoryPanelMenuModel;

  campusPanelMenu = campusPanelMenu;
  schoolManagementPanelMenu = schoolManagementPanelMenu;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private laboratoryService: LaboratoryService
  ) {}

  @HostListener('window:resize', [])
  onResize() {
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth <= 768;
      if (!this.isMobile) {
        this.sidebarCollapsed = false;
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
      // TEMP: fallback to balubal campus if campusName is missing for campus admin
      let campusName = profile.campusName;
      if (profile.role === 'campus admin' && !campusName) {
        campusName = 'balubal campus';
      }
      // console.log('User profile:', profile, 'campusName used:', campusName);
      this.panelMenuItems = getPanelMenuItems(profile.role, campusName);
      // Dynamically populate Schedule submenu in laboratoryPanelMenuModel
      this.laboratoryService.getLaboratories().subscribe((labs: any[]) => {
        // Find the 'Schedule' menu
        const labMenu = this.panelMenuItems.find(
          (item: any) => item.label === 'Laboratory'
        );
        if (labMenu) {
          const scheduleMenu = labMenu.items.find(
            (item: any) => item.label === 'Schedule'
          );
          if (scheduleMenu) {
            // Group labs by laboratory_id and laboratory_name
            const grouped: {
              [labId: string]: { laboratory_name: string; rooms: string[] };
            } = {};
            labs.forEach((lab) => {
              if (!grouped[lab.laboratory_id]) {
                grouped[lab.laboratory_id] = {
                  laboratory_name: lab.laboratory_name,
                  rooms: [],
                };
              }
              grouped[lab.laboratory_id].rooms.push(lab.room_no);
            });
            // Build submenu: each laboratory with its rooms, including laboratory_id in routerLink
            scheduleMenu.items = Object.entries(grouped).map(
              ([labId, { laboratory_name, rooms }]) => ({
                label: laboratory_name,
                icon: 'pi pi-calendar',
                items: rooms.map((room) => ({
                  label: room,
                  icon: 'pi pi-home',
                  items: [],
                  routerLink: ['/home/schedules', labId, room], // Now using laboratory_id
                })),
              })
            );
          }
        }
      });
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

  get isSuperAdmin() {
    return this.user?.role === 'super admin';
  }
}
