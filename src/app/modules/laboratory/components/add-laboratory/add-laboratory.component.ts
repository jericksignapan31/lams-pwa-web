import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { LaboratoryService } from '../../services/laboratory.service';
import Swal from 'sweetalert2';
import { ImportsModule } from '../../../../imports';

@Component({
  selector: 'app-add-laboratory',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, ImportsModule],
  templateUrl: './add-laboratory.component.html',
  styleUrl: './add-laboratory.component.scss',
})
export class AddLaboratoryComponent {
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<any>();

  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private laboratoryService: LaboratoryService
  ) {
    this.form = this.fb.group({
      laboratory_name: ['', Validators.required],
      location: ['', Validators.required],
      room_no: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.laboratoryService.createLaboratory(this.form.value).subscribe({
      next: (res) => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Laboratory Created',
          text: 'The laboratory has been successfully created!',
          timer: 1500,
          showConfirmButton: false,
        });
        this.created.emit(res);
        this.close.emit();
      },
      error: () => {
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to create laboratory.',
        });
      },
    });
  }

  onClose() {
    this.close.emit();
  }
}
