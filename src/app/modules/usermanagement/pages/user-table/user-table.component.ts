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
}
