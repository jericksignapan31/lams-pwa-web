// home.route.ts
import { Route } from '@angular/router';

export const homeRoute: Route[] = [
//   {
//     path: 'dashboard',
//     loadComponent: () =>
//       import('../dashboard/pages/dashboard/dashboard.component').then(
//         (m) => m.DashboardComponent
//       ),
//   },
//   {
//     path: 'equipment',
//     loadComponent: () =>
//       import('../inventory/pages/equipment/equipment.component').then(
//         (m) => m.EquipmentComponent
//       ),
//   },
//   {
//     path: 'laboratory',
//     loadComponent: () =>
//       import('../laboratories/pages/laboratory/laboratory.component').then(
//         (m) => m.LaboratoryComponent
//       ),
//   },
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
