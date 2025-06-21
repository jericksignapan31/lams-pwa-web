import { Route } from '@angular/router';

export const homeRoute: Route[] = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('../dashboard/pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('../usermanagement/pages/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },
  {
    path: 'user-table',
    loadComponent: () =>
      import('../usermanagement/pages/user-table/user-table.component').then(
        (m) => m.UserTableComponent
      ),
  },
  {
    path: 'equipments',
    loadComponent: () =>
      import('../equipments/pages/equipment/equipment.component').then(
        (m) => m.EquipmentComponent
      ),
  },
  {
    path: 'laboratories',
    loadComponent: () =>
      import('../laboratory/pages/laboratories/laboratories.component').then(
        (m) => m.LaboratoriesComponent
      ),
  },

  {
    path: 'schedules/:laboratoryName/:roomName',
    loadComponent: () =>
      import('../schedule/pages/schedules/schedules.component').then(
        (m) => m.SchedulesComponent
      ),
  },
  {
    path: 'schedules',
    loadComponent: () =>
      import('../schedule/pages/schedules/schedules.component').then(
        (m) => m.SchedulesComponent
      ),
  },
  {
    path: 'campuses',
    loadComponent: () =>
      import('../campus/pages/campuses/campuses.component').then(
        (m) => m.CampusesComponent
      ),
  },
  {
    path: 'departments',
    loadComponent: () =>
      import('../department/pages/departments/departments.component').then(
        (m) => m.DepartmentsComponent
      ),
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
