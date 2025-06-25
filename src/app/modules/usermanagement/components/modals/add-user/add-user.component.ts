import { AlertService } from './../../../../../core/services/alert.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../../services/user.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CampusService } from '../../../../campus/services/campus.service';
import { SupabaseService } from '../../../../../core/services/supabase.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    FileUploadModule,
    ButtonModule,
    FloatLabelModule,
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent implements OnInit {
  form: FormGroup;
  campuses: any[] = [];
  loading = false;
  selectedFile: File | null = null;
  uploadingImage = false;
  profileImageUrl: string | null = null;

  @Output() close = new EventEmitter<void>();

  constructor(
    private campusService: CampusService,
    private fb: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    private supabaseService: SupabaseService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      role: [{ value: 'Campus Admin', disabled: true }, Validators.required],
      campus: ['', Validators.required],
      contact_number: ['', Validators.required],
      profile_picture: [null],
    });
  }

  ngOnInit(): void {
    this.campusService.getCampuses().subscribe((data: any) => {
      this.campuses = data;
      // console.log('🔗 Campuses loaded:', this.campuses);
    });
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
      ];
      if (!allowedTypes.includes(file.type)) {
        this.alertService.handleError(
          'Please select a valid image file (JPEG, PNG, GIF)'
        );
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.alertService.handleError('Image file size must be less than 5MB');
        return;
      }

      this.selectedFile = file;
      this.form.patchValue({ profile_picture: file });
    }
  }
  async uploadProfileImage(): Promise<string | null> {
    if (!this.selectedFile) return null;

    try {
      this.uploadingImage = true;

      // Check if bucket exists first, create only if it doesn't
      const bucketExists = await this.supabaseService.bucketExists(
        'profile-pictures'
      );

      if (!bucketExists) {
        try {
          await this.supabaseService.createBucket('profile-pictures');
          console.log('Bucket "profile-pictures" created successfully');
        } catch (error: any) {
          console.log('Error creating bucket:', error);
          // Continue anyway, the bucket might exist now
        }
      } else {
        console.log('Bucket "profile-pictures" already exists');
      }

      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `profiles/${timestamp}_${this.selectedFile.name}`;

      // Upload to Supabase
      const uploadResult = await this.supabaseService.uploadFile(
        this.selectedFile,
        'profile-pictures',
        fileName
      );

      console.log('Upload result:', uploadResult);

      // Get public URL
      const publicUrl = this.supabaseService.getPublicUrl(
        'profile-pictures',
        fileName
      );
      this.profileImageUrl = publicUrl;

      console.log('Profile image public URL:', publicUrl);
      this.alertService.handleSuccess('Profile image uploaded successfully!');
      return publicUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      this.alertService.handleError(
        'Failed to upload profile image: ' + (error as any)?.message ||
          'Unknown error'
      );
      return null;
    } finally {
      this.uploadingImage = false;
    }
  }
  async submit() {
    if (this.form.invalid) return;

    this.loading = true;

    try {
      // Upload profile image to Supabase first (if selected)
      let profileImageUrl = null;
      if (this.selectedFile) {
        profileImageUrl = await this.uploadProfileImage();
        if (!profileImageUrl) {
          this.loading = false;
          return; // Stop if image upload failed
        }
      }

      // Prepare form data for user creation
      const formData = new FormData();
      formData.append('email', this.form.value.email || '');
      formData.append('password', this.form.value.password || '');
      formData.append('first_name', this.form.value.first_name || '');
      formData.append('last_name', this.form.value.last_name || '');
      formData.append('role', 'Campus Admin');
      formData.append(
        'campus',
        this.form.value.campus ? this.form.value.campus : ''
      );
      formData.append('contact_number', this.form.value.contact_number || '');

      // Add Supabase profile image URL instead of file
      if (profileImageUrl) {
        formData.append('profile_picture_url', profileImageUrl);
      }

      // Create user account
      this.userService.createAccount(formData).subscribe({
        next: (res: any) => {
          this.loading = false;
          this.alertService.handleSuccess(
            'Account created successfully with profile image!'
          );
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          this.close.emit();
        },
        error: (err: any) => {
          this.loading = false;
          this.alertService.handleError('Failed to create account.');
          console.error('User creation error:', err);
        },
      });
    } catch (error) {
      this.loading = false;
      this.alertService.handleError(
        'An error occurred while creating the account.'
      );
      console.error('Submit error:', error);
    }
  }

  async testSupabaseConnection() {
    const result = await this.supabaseService.testConnection();
    if (result) {
      this.alertService.handleSuccess('Supabase connection successful!');
    } else {
      this.alertService.handleError(
        'Supabase connection failed. Check console for details.'
      );
    }
  }

  async testStorageUpload() {
    const result = await this.supabaseService.testStorageUpload();
    if (result) {
      this.alertService.handleSuccess('Storage upload test successful!');
    } else {
      this.alertService.handleError(
        'Storage upload test failed. Check console for details.'
      );
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
