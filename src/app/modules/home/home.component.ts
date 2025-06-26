import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
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
    private laboratoryService: LaboratoryService,
    private router: Router
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
    } // Get user info from AuthService instead of making a separate API call
    const userInfo = this.authService.userInfo;
    const userProfile = this.authService.userProfile;

    if (userInfo && userProfile) {
      this.user = userProfile; // Use original profile for template compatibility
      console.log('🔗 User info from AuthService:', userInfo);
      console.log('🔗 User profile for template:', userProfile);

      // TEMP: fallback to balubal campus if campusName is missing for campus admin
      let campusName = userInfo.accountType;
      if (userInfo.accountType === 'campus admin' && !campusName) {
        campusName = 'balubal campus';
      }
      this.panelMenuItems = getPanelMenuItems(userInfo.accountType, campusName);
      this.loadLaboratoryData();
    } else {
      // Fallback: use UserService if userInfo is not yet available in AuthService
      this.userService.getUser().subscribe((profile: any) => {
        this.user = profile;
        // TEMP: fallback to balubal campus if campusName is missing for campus admin
        let campusName = profile.campusName;
        if (profile.role === 'campus admin' && !campusName) {
          campusName = 'balubal campus';
        }
        // console.log('User profile:', profile, 'campusName used:', campusName);
        this.panelMenuItems = getPanelMenuItems(profile.role, campusName);
        this.loadLaboratoryData();
      });
    }
  }

  private loadLaboratoryData() {
    // Dynamically populate laboratory-related menus with real API data
    this.laboratoryService.getLaboratories().subscribe((labs: any[]) => {
      console.log('📋 Loading laboratory data for menus:', labs);

      // 1. Populate Schedule submenu in laboratoryPanelMenuModel (existing functionality)
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

      // 2. NEW: Populate Laboratories submenu in Inventory menu
      const inventoryMenu = this.panelMenuItems.find(
        (item: any) => item.label === 'Inventory'
      );
      if (inventoryMenu) {
        const laboratoriesMenu = inventoryMenu.items.find(
          (item: any) => item.label === 'Laboratories'
        );
        if (laboratoriesMenu) {
          // Get unique laboratory names (no room submenus)
          const uniqueLabs = labs.reduce((acc: any[], lab) => {
            const existingLab = acc.find(
              (l) => l.laboratory_name === lab.laboratory_name
            );
            if (!existingLab) {
              acc.push({
                laboratory_name: lab.laboratory_name,
                laboratory_id: lab.laboratory_id,
              });
            }
            return acc;
          }, []);

          // Build submenu: just laboratory names, clicking goes to room-storage page with lab filter
          laboratoriesMenu.items = uniqueLabs.map((lab) => ({
            label: lab.laboratory_name,
            icon: 'pi pi-flask',
            command: () => {
              console.log(`🧪 Navigating to room storage for laboratory: ${lab.laboratory_name}`);
              // Navigate to the room-storage page with laboratory filter
              this.router.navigate(['/home/room-storage'], { 
                queryParams: { laboratory: lab.laboratory_name, labId: lab.laboratory_id } 
              });
            },
            items: [], // No room submenu
          }));

          console.log(
            '🔧 Populated Laboratories submenu (names only):',
            laboratoriesMenu.items
          );
        }
      }
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
