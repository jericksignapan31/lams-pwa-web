import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { UserModel } from '../../modules/usermanagement/models/user.interface';
import { LoginService } from './login.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _alert = inject(AlertService);
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private readonly TOKEN_NAME = environment.tokenName;
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  user = signal<UserModel | null>(null);
  userInfo: UserModel | null = null;

  constructor(private _login: LoginService, private router: Router) {
    this._isLoggedIn$.next(!!this.token);
    this.userInfo = this.getUser(this.token);
    this.user.set(this.userInfo);
  }

  /**
   * Safely get token from localStorage (SSR-safe)
   */
  get token(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.TOKEN_NAME);
    }
    return null;
  }

  /**
   * Login and update state, store token, and set user info
   */
  login(email: string, password: string): Observable<any> {
    return this._login.login({ email, password }).pipe(
      tap((response: any) => {
        if (!response.access_token) {
          throw new Error('No access token received');
        }
        this._isLoggedIn$.next(true);
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(this.TOKEN_NAME, response.access_token);
        }
        this.userInfo = this.getUser(response.access_token);
        this.user.set(this.userInfo);
      })
    );
  }

  /**
   * Decode JWT and return user info
   */
  public getUser(token: string | null): UserModel | null {
    if (!token) return null;
    try {
      // Validate JWT structure
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1]));
      // Optionally: validate exp, iss, aud, etc. here
      return payload as UserModel;
    } catch {
      return null;
    }
  }

  /**
   * Return observable for login state
   */
  isLogin() {
    return this.isLoggedIn$;
  }

  /**
   * Logout and clear state
   */
  logout() {
    this._alert.simpleAlert(
      'warning',
      'Warning',
      'Are you sure you want to logout?',
      () => {
        this._isLoggedIn$.next(false);
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem(this.TOKEN_NAME);
        }
        this.user.set(null);
        this.userInfo = null;
        if (typeof window !== 'undefined') {
          this.router.navigate(['login']);
        }
      }
    );
  }
}
