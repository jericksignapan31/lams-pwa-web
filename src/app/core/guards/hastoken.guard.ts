import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { environment } from '../../../environments/environment';

export const hastokenGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenName = environment.tokenName
  const token = localStorage.getItem(tokenName);
  if(token){
    router.navigate(['/home'])
    return false;
  } else {
    return true;
  }
};
