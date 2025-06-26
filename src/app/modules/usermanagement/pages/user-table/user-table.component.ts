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

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = null;

    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        // Check if response is an array or has a data property
        if (Array.isArray(response)) {
          this.users = response;
        } else if (response && Array.isArray(response.data)) {
          this.users = response.data;
        } else if (response && Array.isArray(response.results)) {
          this.users = response.results;
        } else {
          console.warn('⚠️ Unexpected response format:', response);
          this.users = [];
        }

        console.log('🔍 Users array:', this.users);
        console.log('🔍 Users count:', this.users.length);

        this.loading = false;
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
