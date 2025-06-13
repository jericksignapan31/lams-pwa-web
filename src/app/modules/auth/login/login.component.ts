import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LoginService } from '../../../core/services/login.service';
import { UserService } from '../../../modules/usermanagement/services/user.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    FormsModule,
  ],
  template: `
    <div class="login-container">
      <p-card class="login-card">
        <div
          style="display: flex; justify-content: flex-end; margin-bottom: 1rem;"
        >
          <button
            pButton
            type="button"
            icon="pi pi-moon"
            class="p-button-text"
            (click)="toggleDarkMode()"
            aria-label="Toggle dark mode"
          ></button>
        </div>
        <div class="logo-container">
          <img
            [src]="
              isDarkMode ? 'images/lams-logo-dm.png' : 'images/lams-logo-lm.png'
            "
            alt="LEMS Logo"
            class="logo"
          />
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="form">
          <div class="p-field">
            <label for="email">Email</label>
            <input id="email" type="text" pInputText formControlName="email" />
          </div>

          <div class="p-field">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              pPassword
              formControlName="password"
            />
          </div>

          <button
            pButton
            type="submit"
            class="login-btn"
            [disabled]="loginForm.invalid || loading"
          >
            <ng-container *ngIf="loading; else loginText">
              <i class="pi pi-spin pi-spinner" style="margin-right: 8px;"></i>
              Logging in...
            </ng-container>
            <ng-template #loginText>Login</ng-template>
          </button>
        </form>
      </p-card>
    </div>
  `,
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UserService],
})
export class LoginComponent {
  loginForm!: FormGroup;
  value!: string;
  loading = false;
  user: any;
  isDarkMode = false;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private userService: UserService
  ) {}

  toggleDarkMode() {
    const html = document.querySelector('html');
    if (html) {
      html.classList.toggle('my-app-dark');
      this.isDarkMode = html.classList.contains('my-app-dark');
      localStorage.setItem('darkMode', this.isDarkMode ? '1' : '0');
    }
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    // SSR-safe: Only access document in browser
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const html = document.querySelector('html');
      if (html && localStorage.getItem('darkMode') === '1') {
        html.classList.add('my-app-dark');
        this.isDarkMode = true;
      } else {
        this.isDarkMode = false;
      }
    }
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.loading = true;
      const loginData = this.loginForm.value;
      this.loginService.login(loginData).subscribe({
        next: (response: any) => {
          this.loading = false;
          localStorage.setItem('access_token', response.access);
          this.userService.getUser().subscribe({
            next: (userProfile: any) => {
              console.log('🔗 User profile from /api/profile/:', userProfile);
              this.user = userProfile;
            },
            error: (err: any) => {
              console.error('❌ Error fetching user profile:', err);
            },
          });
          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'Welcome back!',
            confirmButtonColor: '#f5a623',
          });
          this.router.navigate(['home/']);
        },
        error: (err: any) => {
          this.loading = false;
          console.error('❌ Login failed:', err);
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid credentials.',
            confirmButtonColor: '#f5a623',
          });
        },
      });
    }
  }
}
