import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { UserModel } from '../../models/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-profile-card">
      <h3>User Profile Information</h3>

      <!-- Using userInfo property -->
      <div class="info-section">
        <h4>From AuthService.userInfo:</h4>
        <div *ngIf="userInfo; else noUserInfo">
          <p><strong>ID:</strong> {{ userInfo.id }}</p>
          <p><strong>Name:</strong> {{ userInfo.name }}</p>
          <p><strong>Email:</strong> {{ userInfo.email }}</p>
          <p><strong>Address:</strong> {{ userInfo.address }}</p>
          <p><strong>Account Type:</strong> {{ userInfo.accountType }}</p>
        </div>
        <ng-template #noUserInfo>
          <p>No user information available</p>
        </ng-template>
      </div>

      <!-- Using user signal -->
      <div class="info-section">
        <h4>From AuthService.user() signal:</h4>
        <div *ngIf="userFromSignal; else noUserSignal">
          <p><strong>ID:</strong> {{ userFromSignal.id }}</p>
          <p><strong>Name:</strong> {{ userFromSignal.name }}</p>
          <p><strong>Email:</strong> {{ userFromSignal.email }}</p>
          <p><strong>Address:</strong> {{ userFromSignal.address }}</p>
          <p><strong>Account Type:</strong> {{ userFromSignal.accountType }}</p>
        </div>
        <ng-template #noUserSignal>
          <p>No user information available from signal</p>
        </ng-template>
      </div>

      <div class="info-section">
        <h4>Login Status:</h4>
        <p *ngIf="isLoggedIn$ | async; else notLoggedIn">
          ✅ User is logged in
        </p>
        <ng-template #notLoggedIn>
          <p>❌ User is not logged in</p>
        </ng-template>
      </div>
    </div>
  `,
  styles: [
    `
      .user-profile-card {
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        margin: 20px;
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .info-section {
        margin-bottom: 20px;
        padding: 15px;
        background: #f9f9f9;
        border-radius: 6px;
      }

      h3 {
        color: #333;
        margin-bottom: 20px;
      }

      h4 {
        color: #666;
        margin-bottom: 10px;
        font-size: 14px;
        text-transform: uppercase;
      }

      p {
        margin: 5px 0;
        font-size: 14px;
      }

      strong {
        color: #333;
      }
    `,
  ],
})
export class UserProfileComponent {
  private authService = inject(AuthService);

  // Method 1: Direct access to userInfo property
  get userInfo(): UserModel | null {
    return this.authService.userInfo;
  }

  // Method 2: Using the user signal
  get userFromSignal(): UserModel | null {
    return this.authService.user();
  }

  // Method 3: Observable for login status
  get isLoggedIn$() {
    return this.authService.isLoggedIn$;
  }

  // Example method to demonstrate usage
  getUserDetails(): string {
    const user = this.authService.userInfo;
    if (user) {
      return `Welcome ${user.name}! You are logged in as ${user.accountType}.`;
    }
    return 'No user logged in';
  }

  // Example method using the signal
  getUserFromSignal(): string {
    const user = this.authService.user();
    if (user) {
      return `Signal says: Hello ${user.name}!`;
    }
    return 'No user data in signal';
  }
}
