import { Component, inject, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    AvatarModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    CommonModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  user: any;
  userService = inject(UserService);
  userProfile: any = null;
  editMode = false;
  editForm!: FormGroup;
  loading = false;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit() {
    this.userProfile = this.authService.userProfile;
    console.log('🔍 UserProfile from AuthService:', this.userProfile);

    if (!this.userProfile) {
      this.userService.getUser().subscribe((profile: any) => {
        this.user = profile;
        this.userProfile = profile;
        console.log('🔍 UserProfile from API:', this.userProfile);
        this.populateForm();
      });
    } else {
      this.user = this.userProfile;
      this.populateForm();
    }
  }

  private initializeForm() {
    this.editForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      contact_number: [''],
      department: [''],
      role: [''],
    });
  }

  private populateForm() {
    if (this.userProfile) {
      this.editForm.patchValue({
        first_name: this.userProfile.first_name || '',
        last_name: this.userProfile.last_name || '',
        email: this.userProfile.email || '',
        contact_number: this.userProfile.contact_number || '',
        department: this.userProfile.department || '',
        role: this.userProfile.role || '',
      });
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      // Reset form when canceling edit
      this.populateForm();
    }
  }

  onSave() {
    // Try to get the correct user ID - check multiple possible fields
    const userId = this.userProfile?.user_id || this.userProfile?.id;

    if (this.editForm.valid && userId) {
      this.loading = true;
      const formData = this.editForm.value;

      console.log('🔍 Full userProfile object:', this.userProfile);
      console.log('🔍 Attempting to update user with ID:', userId);
      console.log('🔍 ID type:', typeof userId);
      console.log('🔍 Form data:', formData);
      console.log(
        '🔍 API URL will be:',
        `${this.userService['baseUrl']}/users/${userId}/`
      );

      // Update user profile using UserService
      // First try with specific user ID
      this.userService.updateUser(userId, formData).subscribe({
        next: (response: any) => {
          this.handleUpdateSuccess(response, formData);
        },
        error: (error: any) => {
          console.error('❌ Error updating with user ID:', error);

          // If specific ID fails, try the profile endpoint
          if (error.status === 404) {
            console.log('🔄 Trying profile endpoint instead...');
            this.userService.updateCurrentUserProfile(formData).subscribe({
              next: (response: any) => {
                this.handleUpdateSuccess(response, formData);
              },
              error: (profileError: any) => {
                this.handleUpdateError(profileError);
              },
            });
          } else {
            this.handleUpdateError(error);
          }
        },
      });
    } else {
      console.log('❌ Form is invalid or user ID is missing');
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Data',
        text: 'Please fill in all required fields correctly.',
        confirmButtonColor: '#f5a623',
      });
    }
  }

  private handleUpdateSuccess(response: any, formData: any) {
    this.loading = false;
    this.editMode = false;

    console.log('✅ Profile updated successfully:', response);

    // Update local user data
    this.user = { ...this.user, ...formData };
    this.userProfile = { ...this.userProfile, ...formData };

    // Update AuthService userProfile
    this.authService.userProfile = this.userProfile;

    // Also update userInfo if needed
    if (this.authService.userInfo) {
      const updatedUserInfo = {
        ...this.authService.userInfo,
        name: `${formData.first_name} ${formData.last_name}`,
        email: formData.email,
      };
      this.authService.userInfo = updatedUserInfo;
      this.authService.user.set(updatedUserInfo);
    }

    Swal.fire({
      icon: 'success',
      title: 'Profile Updated',
      text: 'Your profile has been updated successfully!',
      confirmButtonColor: '#f5a623',
      timer: 2000,
      showConfirmButton: false,
    });
  }

  private handleUpdateError(error: any) {
    this.loading = false;
    console.error('❌ Error updating profile:', error);

    let errorMessage = 'Failed to update profile. Please try again.';

    if (error.status === 404) {
      errorMessage = 'User not found. Please contact support.';
    } else if (error.error && error.error.detail) {
      errorMessage = error.error.detail;
    }

    Swal.fire({
      icon: 'error',
      title: 'Update Failed',
      text: errorMessage,
      confirmButtonColor: '#f5a623',
    });
  }
}
