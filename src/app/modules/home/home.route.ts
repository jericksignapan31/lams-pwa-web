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
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
