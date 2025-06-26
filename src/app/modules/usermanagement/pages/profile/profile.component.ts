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
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
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
    FileUploadModule,
    TooltipModule,
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
  selectedProfilePicture: File | null = null;
  profilePicturePreview: string | null = null;

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
      this.resetProfilePicture();
    }
  }

  // Handle profile picture file selection
  onProfilePictureSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File Type',
          text: 'Please select an image file (PNG, JPG, JPEG, etc.)',
          confirmButtonColor: '#f5a623',
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'Please select an image smaller than 5MB',
          confirmButtonColor: '#f5a623',
        });
        return;
      }

      this.selectedProfilePicture = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePicturePreview = e.target.result;
      };
      reader.readAsDataURL(file);

      console.log('🖼️ Profile picture selected:', file.name);
    }
  }

  // Reset profile picture selection
  resetProfilePicture() {
    this.selectedProfilePicture = null;
    this.profilePicturePreview = null;
  }

  // Get current profile picture URL for display
  getCurrentProfilePicture(): string {
    if (this.profilePicturePreview) {
      return this.profilePicturePreview;
    }
    return (
      this.user?.profile_picture ||
      this.user?.avatar ||
      'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png'
    );
  }

  onSave() {
    // Try to get the correct user ID - check multiple possible fields
    const userId = this.userProfile?.user_id || this.userProfile?.id;

    if (this.editForm.valid && userId) {
      this.loading = true;

      // Use FormData for file upload support
      const formData = new FormData();

      // Add form fields
      Object.keys(this.editForm.value).forEach((key) => {
        formData.append(key, this.editForm.value[key] || '');
      });

      // Add profile picture if selected
      if (this.selectedProfilePicture) {
        formData.append('profile_picture', this.selectedProfilePicture);
        console.log('�️ Including profile picture in update');
      }

      console.log('�🔍 Full userProfile object:', this.userProfile);
      console.log('🔍 Attempting to update user with ID:', userId);
      console.log('🔍 ID type:', typeof userId);
      console.log('🔍 Form data keys:', Array.from(formData.keys()));
      console.log(
        '🔍 API URL will be:',
        `${this.userService['baseUrl']}/users/${userId}/`
      );

      // Update user profile using UserService
      // First try with specific user ID
      this.userService.updateUser(userId, formData).subscribe({
        next: (response: any) => {
          this.handleUpdateSuccess(response, this.editForm.value);
        },
        error: (error: any) => {
          console.error('❌ Error updating with user ID:', error);

          // If specific ID fails, try the profile endpoint
          if (error.status === 404) {
            console.log('🔄 Trying profile endpoint instead...');
            this.userService.updateCurrentUserProfile(formData).subscribe({
              next: (response: any) => {
                this.handleUpdateSuccess(response, this.editForm.value);
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
      console.log('❌ Form errors:', this.editForm.errors);
      console.log('❌ Form valid?', this.editForm.valid);
      console.log('❌ User ID:', userId);

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

    // Update profile picture if it was changed
    if (response.profile_picture) {
      this.user.profile_picture = response.profile_picture;
      this.userProfile.profile_picture = response.profile_picture;
    }

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

    // Reset profile picture selection
    this.resetProfilePicture();

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
