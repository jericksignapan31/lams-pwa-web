import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const _auth = inject(AuthService);
  const router = inject(Router);
  // Use observable to check login state reactively
  return _auth.isLoggedIn$.pipe(
    take(1),
    map((isLoggedIn) => {
      if (isLoggedIn) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
