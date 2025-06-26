import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, NgZone, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  tap,
  timer,
  switchMap,
  of,
} from 'rxjs';
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
  userProfile: any = null;
  private refreshKey = 'refresh_token';
  private userActivityEvents = ['mousemove', 'keydown', 'click', 'touchstart'];
  // private inactivityTimeout = 10 * 60 * 1000; // 10 minutes
  // private inactivityTimeout = 60 * 1000; // 60 seconds - COMMENTED OUT
  private inactivityTimeout = 0; // Disabled - no auto logout
  private inactivityTimer?: Subscription;
  private apiUrl = '/api/auth';

  constructor(
    private _login: LoginService,
    private router: Router,
    private http: HttpClient,
    private ngZone: NgZone
  ) {
    this._isLoggedIn$.next(!!this.token);

    // If there's a token, try to fetch user info
    if (this.token) {
      this.fetchUserProfile(this.token).subscribe({
        next: (userProfile: any) => {
          console.log('🔍 Restored user profile:', userProfile);

          const userInfo: UserModel = {
            id: userProfile.id || userProfile.user_id || 0,
            name:
              userProfile.name ||
              userProfile.username ||
              (userProfile.first_name && userProfile.last_name
                ? `${userProfile.first_name} ${userProfile.last_name}`
                : userProfile.first_name || userProfile.last_name || 'User'),
            email: userProfile.email || '',
            address: userProfile.address || userProfile.location || '',
            accountType:
              userProfile.role ||
              userProfile.account_type ||
              userProfile.accountType ||
              'user',
          };

          this.userInfo = userInfo;
          this.user.set(userInfo);
          this.userProfile = userProfile;
        },
        error: (err) => {
          console.log('⚠️ Could not fetch user profile on init:', err);
          // Token might be expired, clear it
          this.logout(true);
        },
      });
    }

    if (typeof window !== 'undefined') {
      // Commented out inactivity listener - no more auto logout
      // this.initInactivityListener();
    }
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
        // Debug: log the response to see the actual structure
        console.log('🔍 Login response:', response);

        // Handle multiple possible response formats
        const token =
          response.access_token || response.access || response.token;

        if (!token) {
          console.error(
            '❌ No access token found in response. Response keys:',
            Object.keys(response)
          );
          throw new Error('No access token received');
        }

        this._isLoggedIn$.next(true);
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(this.TOKEN_NAME, token);
        }
      }),
      switchMap((response: any) => {
        // After storing the token, fetch user profile
        const token =
          response.access_token || response.access || response.token;
        return this.fetchUserProfile(token);
      }),
      tap((userProfile: any) => {
        console.log('🔍 User profile response:', userProfile);

        // Map the user profile to our UserModel interface
        const userInfo: UserModel = {
          id: userProfile.id || userProfile.user_id || 0,
          name:
            userProfile.name ||
            userProfile.username ||
            (userProfile.first_name && userProfile.last_name
              ? `${userProfile.first_name} ${userProfile.last_name}`
              : userProfile.first_name || userProfile.last_name || 'User'),
          email: userProfile.email || '',
          address: userProfile.address || userProfile.location || '',
          accountType:
            userProfile.role ||
            userProfile.account_type ||
            userProfile.accountType ||
            'user',
        };

        this.userInfo = userInfo;
        this.user.set(userInfo);
        this.userProfile = userProfile;

        console.log('✅ User info mapped and set:', this.userInfo);
      })
    );
  }

  /**
   * Fetch user profile from API
   */
  private fetchUserProfile(token: string): Observable<any> {
    if (typeof window === 'undefined') {
      return of({});
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${environment.baseUrl}/users/profile/`, { headers });
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
  logout(silent = false) {
    if (silent) {
      if (typeof window !== 'undefined') {
        this._alert.simpleAlert(
          'info',
          'Logged out',
          'Your session has expired. Please log in again.',
          () => {
            this._isLoggedIn$.next(false);
            if (typeof window !== 'undefined' && window.localStorage) {
              localStorage.removeItem(this.TOKEN_NAME);
              localStorage.removeItem(this.refreshKey);
            }
            this.user.set(null);
            this.userInfo = null;
            window.location.replace('/login');
          }
        );
      }
      return;
    }
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
        this.userProfile = null;
        this.userProfile = null;
        if (typeof window !== 'undefined') {
          window.location.replace('/login');
        }
      }
    );
  }

  saveTokens(access: string, refresh: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.TOKEN_NAME, access);
      localStorage.setItem(this.refreshKey, refresh);
    }
    this._isLoggedIn$.next(true);
    // Commented out - inactivity timer is disabled
    // this.resetInactivityTimer();
  }

  getRefreshToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.refreshKey);
    }
    return null;
  }

  refreshToken(): Observable<any> {
    const refresh = this.getRefreshToken();
    return this.http.post(`${this.apiUrl}/token/refresh/`, { refresh });
  }

  // Inactivity logic
  private initInactivityListener() {
    if (typeof window === 'undefined') return;
    this.userActivityEvents.forEach((event) => {
      window.addEventListener(event, () => this.resetInactivityTimer());
    });
    this.resetInactivityTimer();
  }

  private resetInactivityTimer() {
    // Don't set timer if inactivity timeout is disabled (0)
    if (this.inactivityTimeout <= 0) {
      console.log('🔍 Inactivity timer disabled - not setting timer');
      return;
    }

    this.clearInactivityTimer();
    this.ngZone.runOutsideAngular(() => {
      this.inactivityTimer = timer(this.inactivityTimeout).subscribe(() => {
        this.ngZone.run(() => this.logout(true));
      });
    });
  }

  private clearInactivityTimer() {
    if (this.inactivityTimer) {
      this.inactivityTimer.unsubscribe();
      this.inactivityTimer = undefined;
    }
  }
}
