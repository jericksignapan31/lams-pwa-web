import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user.interface';
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
export class UserTableComponent {
  users: any[] = [];
  showAddUserModal = false;

  constructor(private userService: UserService) {
    this.userService.getAllUsers().subscribe({
      next: (userProfile: any) => {
        console.log('🔗 User profile from /api/users/:', userProfile);
        this.users = userProfile;
      },
      error: (err: any) => {
        console.error('❌ Error fetching user profile:', err);
      },
    });
  }

  openAddUserModal() {
    this.showAddUserModal = true;
  }

  closeAddUserModal() {
    this.showAddUserModal = false;
  }

  async deleteUser(user: any) {
    if (!user || !user.user_id) return;
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
      this.userService.deleteUser(user.user_id).subscribe({
        next: () => {
          this.users = this.users.filter((u) => u.user_id !== user.user_id);
          Swal.fire('Deleted!', 'User has been deleted.', 'success');
        },
        error: (err: any) => {
          Swal.fire('Failed!', 'Failed to delete user.', 'error');
          console.error('Delete error:', err);
        },
      });
    }
  }
}
