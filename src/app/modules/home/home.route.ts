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
  //   {
  //     path: 'maintenance',
  //     loadComponent: () =>
  //       import('../maintenances/pages/maintenance/maintenance.component').then(
  //         (m) => m.MaintenanceComponent
  //       ),
  //   },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
