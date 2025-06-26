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
import { AuthService } from '../../../../../core/services/auth.service';

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
  assignedRole = '';

  @Output() close = new EventEmitter<void>();

  constructor(
    private campusService: CampusService,
    private fb: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    private authService: AuthService
  ) {
    // Determine the role to assign based on current user's role
    this.assignedRole = this.getAssignedRole();

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      role: [{ value: this.assignedRole, disabled: true }, Validators.required],
      campus: ['', Validators.required],
      contact_number: ['', Validators.required],
      profile_picture: [null],
    });
  }

  private getAssignedRole(): string {
    const currentUserRole =
      this.authService.userProfile?.role?.toLowerCase() ||
      this.authService.userInfo?.accountType?.toLowerCase() ||
      '';

    console.log('🔍 Current user role:', currentUserRole);

    switch (currentUserRole) {
      case 'super admin':
        return 'Campus Admin';
      case 'campus admin':
        return 'Faculty';
      case 'faculty':
        return 'Laboratory Technician';
      default:
        // Fallback to Campus Admin if role is unclear
        return 'Campus Admin';
    }
  }

  ngOnInit(): void {
    this.campusService.getCampuses().subscribe((data: any) => {
      this.campuses = data;
      // console.log('🔗 Campuses loaded:', this.campuses);
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.form.patchValue({ profile_picture: file });
  }

  submit() {
    if (this.form.invalid) return;
    const formData = new FormData();
    formData.append('email', this.form.value.email || '');
    formData.append('password', this.form.value.password || '');
    formData.append('first_name', this.form.value.first_name || '');
    formData.append('last_name', this.form.value.last_name || '');
    formData.append('role', this.assignedRole); // Use the dynamically assigned role
    formData.append(
      'campus',
      this.form.value.campus ? this.form.value.campus : ''
    );
    formData.append('contact_number', this.form.value.contact_number || '');
    if (this.form.value.profile_picture) {
      formData.append('profile_picture', this.form.value.profile_picture);
    }

    console.log('🔍 Creating account with role:', this.assignedRole);

    this.loading = true;
    this.userService.createAccount(formData).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.alertService.handleSuccess(
          `Account created successfully with role: ${this.assignedRole}!`
        );
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        this.close.emit();
      },
      error: (err: any) => {
        this.loading = false;
        this.alertService.handleError('Failed to create account.');
      },
    });
  }
}
