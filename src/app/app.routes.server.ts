import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Routes with parameters should use Client-side rendering
  {
    path: 'home/schedules/:laboratoryId/:roomName',
    renderMode: RenderMode.Client,
  },
  // Other specific routes that need client-side rendering
  {
    path: 'home/schedules/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'home/equipment/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'home/laboratories/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'home/usermanagement/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'home/departments/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'home/campuses/**',
    renderMode: RenderMode.Client,
  },
  // Static routes can be prerendered
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'login',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'home',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'home/dashboard',
    renderMode: RenderMode.Prerender,
  },
  // All other routes use client-side rendering
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];
