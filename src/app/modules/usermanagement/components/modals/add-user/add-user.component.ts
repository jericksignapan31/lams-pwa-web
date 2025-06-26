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
    ButtonModule,
    FloatLabelModule,
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent implements OnInit {
  form!: FormGroup;
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

    // Create form based on user role
    this.createFormBasedOnRole();
  }

  private createFormBasedOnRole(): void {
    const currentUserRole =
      this.authService.userProfile?.role?.toLowerCase() ||
      this.authService.userInfo?.accountType?.toLowerCase() ||
      '';

    console.log('🔍 Creating form for user role:', currentUserRole);

    if (currentUserRole === 'super admin') {
      // Super Admin: Show campus selection
      this.form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        campus: ['', Validators.required],
        contact_number: ['', Validators.required],
      });
    } else {
      // Campus Admin or Faculty: No campus selection needed
      this.form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        contact_number: ['', Validators.required],
      });
    }
  }

  // Method to check if current user is Super Admin
  isSuperAdmin(): boolean {
    const currentUserRole =
      this.authService.userProfile?.role?.toLowerCase() ||
      this.authService.userInfo?.accountType?.toLowerCase() ||
      '';
    return currentUserRole === 'super admin';
  }

  private getAssignedRole(): string {
    const currentUserRole =
      this.authService.userProfile?.role?.toLowerCase() ||
      this.authService.userInfo?.accountType?.toLowerCase() ||
      '';

    console.log('🔍 Current user role:', currentUserRole);

    switch (currentUserRole) {
      case 'super admin':
        return 'campus admin';
      case 'campus admin':
        return 'faculty';
      case 'faculty':
        return 'laboratory technician';
      default:
        return 'Campus Admin';
    }
  }

  ngOnInit(): void {
    console.log('🔍 AddUserComponent - Loading campuses...');
    this.loadCampusesBasedOnRole();
  }

  private loadCampusesBasedOnRole(): void {
    const currentUserRole =
      this.authService.userProfile?.role?.toLowerCase() ||
      this.authService.userInfo?.accountType?.toLowerCase() ||
      '';

    console.log('🔍 Current user role for campus filtering:', currentUserRole);

    if (currentUserRole === 'super admin') {
      // Super Admin: Load all campuses
      this.loadAllCampuses();
    } else {
      // Campus Admin or Faculty: Only show their assigned campus
      this.loadUserAssignedCampus();
    }
  }

  private loadAllCampuses(): void {
    console.log('🏢 Super Admin - Loading all campuses...');

    this.campusService.getCampuses().subscribe({
      next: (data: any) => {
        console.log('✅ All campuses loaded successfully:', data);
        this.processCampusesResponse(data);
      },
      error: (error: any) => {
        this.handleCampusLoadError(error);
      },
    });
  }

  private loadUserAssignedCampus(): void {
    // For Campus Admin and Faculty, we don't show campus field in UI
    // But we still need to know their assigned campus for backend submission
    const userCampus =
      this.authService.userProfile?.campus ||
      this.authService.userProfile?.assigned_campus;

    console.log('🏢 Campus Admin/Faculty - User assigned campus:', userCampus);

    if (userCampus) {
      // Store the campus for form submission, but don't show it in UI
      this.campuses = [userCampus];
      console.log('🔒 Campus stored for automatic assignment:', userCampus);
    } else {
      console.log('⚠️ No assigned campus found for Campus Admin/Faculty');
      this.campuses = [];
    }
  }

  private processCampusesResponse(data: any): void {
    // Handle different response formats
    if (Array.isArray(data)) {
      this.campuses = data;
    } else if (data && Array.isArray(data.data)) {
      this.campuses = data.data;
    } else if (data && Array.isArray(data.results)) {
      this.campuses = data.results;
    } else {
      console.warn('⚠️ Unexpected campuses response format:', data);
      this.campuses = [];
    }

    console.log('🔍 Processed campuses array:', this.campuses);
    console.log('� Campuses count:', this.campuses.length);
  }

  private handleCampusLoadError(error: any): void {
    console.error('❌ Error loading campuses:', error);
    console.error('❌ Error status:', error.status);
    console.error('❌ Error details:', error.error);

    let errorMessage = 'Failed to load campuses.';

    if (error.status === 403) {
      errorMessage =
        'Access denied to campuses. You may not have permission to view campuses.';
      console.error(
        '🚫 403 Forbidden - Check user permissions for /api/campuses/'
      );
    } else if (error.status === 401) {
      errorMessage = 'Authentication failed. Please log in again.';
    } else if (error.status === 500) {
      errorMessage = 'Server error when loading campuses.';
    }

    // Set empty array so form still works
    this.campuses = [];

    // Show user-friendly error (but don't block the modal)
    this.alertService.handleError(errorMessage);
  }

  submit() {
    if (this.form.invalid) return;

    const formData = new FormData();
    formData.append('email', this.form.value.email || '');
    formData.append('password', this.form.value.password || '');
    formData.append('first_name', this.form.value.first_name || '');
    formData.append('last_name', this.form.value.last_name || '');
    formData.append('role', this.assignedRole); // Use the dynamically assigned role

    // Handle campus value based on user role
    let campusValue = '';
    if (this.isSuperAdmin()) {
      // Super Admin: Get campus from form selection
      campusValue = this.form.value.campus || '';
    } else {
      // Campus Admin/Faculty: Use their assigned campus
      const userCampus = this.campuses[0]; // First (and only) campus in array
      campusValue = userCampus ? userCampus.campus_id || userCampus.id : '';
    }
    formData.append('campus', campusValue);

    formData.append('contact_number', this.form.value.contact_number || '');

    // Profile picture is handled automatically by backend
    // Role is determined by the logic above

    console.log('🔍 Creating account with role:', this.assignedRole);
    console.log('🔍 Creating account with campus:', campusValue);
    console.log(
      '🔍 User type:',
      this.isSuperAdmin() ? 'Super Admin' : 'Campus Admin/Faculty'
    );

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
