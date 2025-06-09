// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./modules/auth/login/login.component').then(m => m.LoginComponent),
    title: 'Login',
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
//   {
//     path: 'home',
//     loadComponent: () =>
//       import('./modules/home/home.component').then(m => m.HomeComponent),
//     children: homeRoute,
//   }
];
