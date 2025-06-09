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
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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

    HttpClientModule,
  ],
  template: `<div class="login-container">
    <p-card class="login-card">
      <div class="logo-container">
        <img src="images/logo.png" alt="LEMS Logo" class="logo" />
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
          label="Login"
          class="login-btn"
          [disabled]="loginForm.invalid"
        ></button>
      </form>
    </p-card>
  </div> `,
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm!: FormGroup;
  value!: string;

  constructor(public fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'Welcome back!',
        confirmButtonColor: '#f5a623',
      });
      this.router.navigate(['home/']);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Please check your email and password.',
        confirmButtonColor: '#f5a623',
      });
    }
  }
}
