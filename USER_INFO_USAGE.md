# How to Use User Info in LAMS PWA

## Overview

Ang auth service mo ay may `userInfo: UserModel | null = null` na property. Pag nag-login ang user, automatically na-populate na ito ng user information.

## User Model Interface

```typescript
export interface UserModel {
  id: number;
  name: string;
  email: string;
  address: string;
  accountType: string;
}
```

## Ways to Access User Info

### 1. Direct Access sa userInfo Property

```typescript
import { AuthService } from '../core/services/auth.service';

@Component({...})
export class YourComponent {
  constructor(private authService: AuthService) {}

  getUserName(): string {
    const user = this.authService.userInfo;
    return user ? user.name : 'Guest';
  }
}
```

### 2. Using Signal (Reactive)

```typescript
import { AuthService } from '../core/services/auth.service';

@Component({...})
export class YourComponent {
  private authService = inject(AuthService);

  // Signal na automatically nag-uupdate
  currentUser = this.authService.user;

  // Sa template:
  // <p>Hello {{ currentUser()?.name }}!</p>
}
```

### 3. Using Observable para sa Login Status

```typescript
import { AuthService } from '../core/services/auth.service';

@Component({...})
export class YourComponent {
  constructor(private authService: AuthService) {}

  isLoggedIn$ = this.authService.isLoggedIn$;

  // Sa template:
  // <div *ngIf="isLoggedIn$ | async">User is logged in!</div>
}
```

## Example Usage sa Template

```html
<!-- Check if user exists -->
<div *ngIf="authService.userInfo">
  <h2>Welcome, {{ authService.userInfo.name }}!</h2>
  <p>Email: {{ authService.userInfo.email }}</p>
  <p>Account Type: {{ authService.userInfo.accountType }}</p>
</div>

<!-- Using signal -->
<div *ngIf="currentUser()">
  <h2>Hello {{ currentUser()?.name }}!</h2>
</div>

<!-- Check account type -->
<div *ngIf="authService.userInfo?.accountType === 'admin'">
  <p>Admin controls here</p>
</div>
```

## Best Practices

1. **Always check if user exists** bago i-access ang properties:

   ```typescript
   const user = this.authService.userInfo;
   if (user) {
     console.log(user.name);
   }
   ```

2. **Use optional chaining** sa templates:

   ```html
   <p>{{ authService.userInfo?.name }}</p>
   ```

3. **Use signals** para sa reactive updates:

   ```typescript
   currentUser = this.authService.user;
   ```

4. **Check account type** para sa role-based access:
   ```typescript
   isAdmin(): boolean {
     return this.authService.userInfo?.accountType === 'admin';
   }
   ```

## Complete Example

```typescript
import { Component, inject } from "@angular/core";
import { AuthService } from "../core/services/auth.service";
import { UserModel } from "../modules/usermanagement/models/user.interface";

@Component({
  selector: "app-user-dashboard",
  template: `
    <div class="user-dashboard">
      <div *ngIf="userInfo; else loginPrompt">
        <h1>Welcome, {{ userInfo.name }}!</h1>
        <div class="user-details">
          <p><strong>Email:</strong> {{ userInfo.email }}</p>
          <p><strong>Address:</strong> {{ userInfo.address }}</p>
          <p><strong>Account Type:</strong> {{ userInfo.accountType }}</p>
        </div>

        <!-- Role-based content -->
        <div *ngIf="isAdmin()" class="admin-section">
          <h2>Admin Panel</h2>
          <p>Admin-only content here</p>
        </div>

        <div *ngIf="isCampusAdmin()" class="campus-admin-section">
          <h2>Campus Management</h2>
          <p>Campus admin content here</p>
        </div>
      </div>

      <ng-template #loginPrompt>
        <p>Please log in to access your dashboard.</p>
      </ng-template>
    </div>
  `,
})
export class UserDashboardComponent {
  private authService = inject(AuthService);

  get userInfo(): UserModel | null {
    return this.authService.userInfo;
  }

  isAdmin(): boolean {
    return this.userInfo?.accountType === "admin";
  }

  isCampusAdmin(): boolean {
    return this.userInfo?.accountType === "campus admin";
  }

  getGreeting(): string {
    const user = this.userInfo;
    if (user) {
      const time = new Date().getHours();
      const greeting = time < 12 ? "Good morning" : time < 18 ? "Good afternoon" : "Good evening";
      return `${greeting}, ${user.name}!`;
    }
    return "Welcome!";
  }
}
```

## Changes Made

1. **Updated login component** to use `AuthService.login()` instead of separate API calls
2. **Updated home component** to use `authService.userInfo` directly
3. **User info is automatically populated** during login in the AuthService
4. **No need for additional UserService calls** - everything is handled by AuthService

## Summary

- **authService.userInfo**: Direct access to user data
- **authService.user()**: Signal for reactive updates
- **authService.isLoggedIn$**: Observable for login status
- Always check if user exists before accessing properties
- Use in any component by injecting AuthService
