// /**
//  * PAANO GAMITIN ANG USER INFO SA LAHAT NG COMPONENTS
//  * =================================================
//  *
//  * Sa auth service mo ay may userInfo: UserModel | null = null;
//  * Maaari mo itong gamitin sa lahat ng components pag nag-login na ang user.
//  */

// import { Component, inject, OnInit } from '@angular/core';
// import { AuthService } from '../core/services/auth.service';
// import { UserModel } from '../modules/usermanagement/models/user.interface';

// // Example 1: Using inject() - Modern Angular approach
// @Component({
//   selector: 'app-example-using-inject',
//   template: `
//     <div>
//       <h2>User Info gamit ang inject()</h2>
//       <p *ngIf="userInfo">Hello {{ userInfo?.name }}!</p>
//       <p *ngIf="userInfo">Account Type: {{ userInfo?.accountType }}</p>
//     </div>
//   `,
// })
// export class ExampleUsingInject {
//   private authService = inject(AuthService);

//   get userInfo(): UserModel | null {
//     return this.authService.userInfo;
//   }
// }

// // Example 2: Using constructor injection - Traditional approach
// @Component({
//   selector: 'app-example-using-constructor',
//   template: `
//     <div>
//       <h2>User Info gamit ang constructor injection</h2>
//       <p *ngIf="userInfo">Hello {{ userInfo?.name }}!</p>
//       <p *ngIf="userInfo">Email: {{ userInfo?.email }}</p>
//     </div>
//   `,
// })
// export class ExampleUsingConstructor {
//   constructor(private authService: AuthService) {}

//   get userInfo(): UserModel | null {
//     return this.authService.userInfo;
//   }
// }

// // Example 3: Using the user signal (reactive)
// @Component({
//   selector: 'app-example-using-signal',
//   template: `
//     <div>
//       <h2>User Info gamit ang signal (reactive)</h2>
//       <p *ngIf="currentUser()">Hello {{ currentUser()?.name }}!</p>
//       <p *ngIf="currentUser()">Address: {{ currentUser()?.address }}</p>
//     </div>
//   `,
// })
// export class ExampleUsingSignal {
//   private authService = inject(AuthService);

//   // Reactive user signal
//   currentUser = this.authService.user;
// }

// // Example 4: Using in methods
// @Component({
//   selector: 'app-example-methods',
//   template: `
//     <div>
//       <h2>User Info sa methods</h2>
//       <button (click)="showUserDetails()">Show User Details</button>
//       <button (click)="checkIfAdmin()">Check if Admin</button>
//       <p>{{ message }}</p>
//     </div>
//   `,
// })
// export class ExampleMethods {
//   message = '';

//   constructor(private authService: AuthService) {}

//   showUserDetails() {
//     const user = this.authService.userInfo;
//     if (user) {
//       this.message = `User: ${user.name} (${user.email}) - ${user.accountType}`;
//     } else {
//       this.message = 'No user logged in';
//     }
//   }

//   checkIfAdmin() {
//     const user = this.authService.userInfo;
//     if (user && user.accountType === 'admin') {
//       this.message = 'User is an admin!';
//     } else if (user) {
//       this.message = `User is not an admin. Account type: ${user.accountType}`;
//     } else {
//       this.message = 'No user logged in';
//     }
//   }
// }

// // Example 5: Using in component lifecycle
// @Component({
//   selector: 'app-example-lifecycle',
//   template: `
//     <div>
//       <h2>User Info sa ngOnInit</h2>
//       <p>{{ welcomeMessage }}</p>
//     </div>
//   `,
// })
// export class ExampleLifecycle implements OnInit {
//   welcomeMessage = '';

//   constructor(private authService: AuthService) {}

//   ngOnInit() {
//     // Get user info on component initialization
//     const user = this.authService.userInfo;
//     if (user) {
//       this.welcomeMessage = `Welcome back, ${user.name}! You are logged in as ${user.accountType}.`;

//       // Example: Different behavior based on user type
//       switch (user.accountType) {
//         case 'admin':
//           console.log('Loading admin features...');
//           break;
//         case 'campus admin':
//           console.log('Loading campus admin features...');
//           break;
//         default:
//           console.log('Loading user features...');
//       }
//     } else {
//       this.welcomeMessage = 'Please log in to continue.';
//     }
//   }
// }

// // Example 6: Using observables for reactive updates
// @Component({
//   selector: 'app-example-observable',
//   template: `
//     <div>
//       <h2>User Info gamit ang observable</h2>
//       <p *ngIf="isLoggedIn$ | async">User is logged in!</p>
//       <p *ngIf="!(isLoggedIn$ | async)">Please log in.</p>
//     </div>
//   `,
// })
// export class ExampleObservable {
//   isLoggedIn$;

//   constructor(private authService: AuthService) {
//     // Observable for login status
//     this.isLoggedIn$ = this.authService.isLoggedIn$;
//   }
// }

// /**
//  * SUMMARY ng mga paraan:
//  *
//  * 1. Direct access: this.authService.userInfo
//  * 2. Signal (reactive): this.authService.user()
//  * 3. Observable (login status): this.authService.isLoggedIn$
//  *
//  * Best practices:
//  * - Use signals para sa reactive updates
//  * - Check if user exists bago i-access ang properties
//  * - Use sa ngOnInit para sa initialization logic
//  * - Use observables para sa reactive UI updates
//  */
