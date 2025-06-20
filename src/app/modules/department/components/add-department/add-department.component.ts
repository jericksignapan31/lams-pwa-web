import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DepartmentService } from '../../services/department.service';
import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../../../imports';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-department',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ImportsModule],
  templateUrl: './add-department.component.html',
  styleUrl: './add-department.component.scss',
})
export class AddDepartmentComponent {
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<any>();

  departmentForm: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService
  ) {
    this.departmentForm = this.fb.group({
      department_name: ['', Validators.required],
      department_head: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.departmentForm.invalid) return;
    this.loading = true;
    this.error = null;
    this.success = null;
    this.departmentService
      .createDepartment(this.departmentForm.value)
      .subscribe({
        next: (res) => {
          this.created.emit(res);
          this.departmentForm.reset();
          this.loading = false;
          this.success = 'Department added successfully!';
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Department added successfully!',
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            this.onClose();
          });
        },
        error: (err) => {
          this.error = 'Failed to add department.';
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to add department.',
          });
        },
      });
  }

  onClose() {
    this.close.emit();
  }
}
