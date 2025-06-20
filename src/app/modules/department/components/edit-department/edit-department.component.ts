import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DepartmentService } from '../../services/department.service';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import Swal from 'sweetalert2';
import { ImportsModule } from '../../../../imports';

@Component({
  selector: 'app-edit-department',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ImportsModule],
  templateUrl: './edit-department.component.html',
  styleUrl: './edit-department.component.scss',
})
export class EditDepartmentComponent implements OnChanges {
  @Input() department: any;
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<any>();

  departmentForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService
  ) {
    this.departmentForm = this.fb.group({
      department_name: ['', Validators.required],
      department_head: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['department'] && this.department) {
      this.departmentForm.patchValue({
        department_name: this.department.department_name,
        department_head: this.department.department_head,
      });
    }
  }

  onSubmit() {
    if (this.departmentForm.invalid || !this.department?.department_id) return;
    this.loading = true;
    this.error = null;
    this.departmentService
      .updateDepartment(
        this.department.department_id,
        this.departmentForm.value
      )
      .subscribe({
        next: (res) => {
          this.updated.emit(res);
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Department updated successfully!',
            timer: 1500,
            showConfirmButton: false,
          }).then(() => {
            this.onClose();
          });
        },
        error: (err) => {
          this.error = 'Failed to update department.';
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update department.',
          });
        },
      });
  }

  onClose() {
    this.close.emit();
  }
}
