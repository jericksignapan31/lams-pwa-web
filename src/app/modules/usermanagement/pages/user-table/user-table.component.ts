import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AddUserComponent } from '../../components/modals/add-user/add-user.component';
import { DialogModule } from 'primeng/dialog';
import Swal from 'sweetalert2';
import { ImportsModule } from '../../../../imports';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    AvatarModule,
    ButtonModule,
    InputTextModule,
    AddUserComponent,
    DialogModule,
    ImportsModule,
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss',
})
export class UserTableComponent implements OnInit {
  users: any[] = [];
  showAddUserModal = false;
  loading = true;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  // Get current user's role
  getCurrentUserRole(): string {
    const currentUserRole =
      this.authService.userProfile?.role?.toLowerCase() ||
      this.authService.userInfo?.accountType?.toLowerCase() ||
      '';

    console.log('🔍 Current user role in UserTable:', currentUserRole);
    return currentUserRole;
  }

  // Check if current user can add users (only Super Admin and Campus Admin)
  canAddUsers(): boolean {
    const currentUserRole = this.getCurrentUserRole();
    return currentUserRole === 'super admin' || currentUserRole === 'campus admin';
  }

  // Filter users based on current user's role
  filterUsersByRole(users: any[]): any[] {
    const currentUserRole = this.getCurrentUserRole();

    switch (currentUserRole) {
      case 'super admin':
        // Super Admin can see all users
        console.log('🔍 Super Admin - showing all users');
        return users;

      case 'campus admin':
        // Campus Admin can see Faculty and Laboratory Technicians
        const campusAdminFiltered = users.filter((user) => {
          const userRole = (user.role || '').toLowerCase();
          return userRole === 'faculty' || userRole === 'laboratory technician';
        });
        console.log(
          '🔍 Campus Admin - showing Faculty and Lab Technicians:',
          campusAdminFiltered.length
        );
        return campusAdminFiltered;

      case 'faculty':
        // Faculty can only see Laboratory Technicians
        const facultyFiltered = users.filter((user) => {
          const userRole = (user.role || '').toLowerCase();
          return userRole === 'laboratory technician';
        });
        console.log(
          '🔍 Faculty - showing only Laboratory Technicians:',
          facultyFiltered.length
        );
        return facultyFiltered;

      default:
        // For other roles or unknown roles, show no users
        console.log('🔍 Unknown role - showing no users');
        return [];
    }
  }

  loadUsers() {
    this.loading = true;
    this.error = null;

    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        // Check if response is an array or has a data property
        let allUsers: any[] = [];
        if (Array.isArray(response)) {
          allUsers = response;
        } else if (response && Array.isArray(response.data)) {
          allUsers = response.data;
        } else if (response && Array.isArray(response.results)) {
          allUsers = response.results;
        } else {
          console.warn('⚠️ Unexpected response format:', response);
          allUsers = [];
        }

        console.log('🔍 All users from API:', allUsers);
        console.log('🔍 All users count:', allUsers.length);

        // Apply role-based filtering
        this.users = this.filterUsersByRole(allUsers);

        console.log('🔍 Filtered users array:', this.users);
        console.log('🔍 Filtered users count:', this.users.length);

        this.loading = false;
      },
      error: (error: any) => {
        console.error('❌ Error loading users:', error);
        this.loading = false;
        this.error = 'Failed to load users';
      },
    });
  }

  openAddUserModal() {
    this.showAddUserModal = true;
  }

  closeAddUserModal() {
    this.showAddUserModal = false;
    // Reload users after adding a new user
    this.loadUsers();
  }

  async deleteUser(user: any) {
    if (!user || (!user.user_id && !user.id)) {
      console.warn('⚠️ No user ID found for deletion');
      return;
    }

    const userId = user.user_id || user.id;

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter((u) => (u.user_id || u.id) !== userId);
          Swal.fire('Deleted!', 'User has been deleted.', 'success');
        },
        error: (err: any) => {
          Swal.fire('Failed!', 'Failed to delete user.', 'error');
          console.error('Delete error:', err);
        },
      });
    }
  }

  retryLoadUsers() {
    console.log('🔄 Retrying to load users...');
    this.loadUsers();
  }

  // Method to test if backend is accessible
  testBackendHealth() {
    console.log('🏥 Testing backend health...');

    // Try to hit a simpler endpoint first
    this.userService.getUser().subscribe({
      next: (response: any) => {
        console.log('✅ Backend profile endpoint working:', response);
        Swal.fire({
          icon: 'info',
          title: 'Backend Status',
          text: 'Backend is accessible via profile endpoint. The issue is specifically with the /api/users/ endpoint.',
          confirmButtonColor: '#f5a623',
        });
      },
      error: (error: any) => {
        console.error('❌ Backend profile endpoint also failing:', error);

        let errorMessage = 'Backend server is not accessible.';

        if (error.status === 500) {
          errorMessage = 'Backend server is experiencing internal errors.';
        } else if (error.status === 403) {
          errorMessage = 'Authentication token may be expired or invalid.';
        } else if (error.status === 401) {
          errorMessage = 'You are not authenticated. Please log in again.';
        } else if (error.status === 0) {
          errorMessage =
            "Cannot connect to backend server. Check if it's running.";
        }

        Swal.fire({
          icon: 'error',
          title: 'Backend Server Issues',
          html: `
            <p>${errorMessage}</p>
            <hr>
            <small>
              <strong>Common Solutions:</strong><br>
              • Check if backend server is running<br>
              • Verify your authentication token<br>
              • Try logging out and logging back in<br>
              • Contact system administrator<br>
              <br>
              <strong>Error Details:</strong><br>
              Status: ${error.status} ${error.statusText || ''}<br>
              Endpoint: ${error.url || 'Profile endpoint'}
            </small>
          `,
          confirmButtonColor: '#f5a623',
          width: '500px',
        });
      },
    });
  }
}
