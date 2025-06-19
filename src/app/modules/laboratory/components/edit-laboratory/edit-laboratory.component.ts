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
  FormsModule,
} from '@angular/forms';
import { LaboratoryService } from '../../services/laboratory.service';
import Swal from 'sweetalert2';
import { ImportsModule } from '../../../../imports';

@Component({
  selector: 'app-edit-laboratory',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, ImportsModule],
  templateUrl: './edit-laboratory.component.html',
  styleUrl: './edit-laboratory.component.scss',
})
export class EditLaboratoryComponent implements OnChanges {
  @Input() laboratory: any;
  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<any>();

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['laboratory'] && this.laboratory) {
      this.form.patchValue({
        laboratory_name: this.laboratory.laboratory_name || '',
        location: this.laboratory.location || '',
        room_no: this.laboratory.room_no || '',
      });
    }
  }

  submit() {
    if (this.form.invalid || !this.laboratory?.laboratory_id) return;
    this.loading = true;
    this.laboratoryService
      .updateLaboratory(this.laboratory.laboratory_id, this.form.value)
      .subscribe({
        next: (res) => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Laboratory Updated',
            text: 'The laboratory has been successfully updated!',
            timer: 1500,
            showConfirmButton: false,
          });
          this.updated.emit(res);
          this.close.emit();
        },
        error: () => {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update laboratory.',
          });
        },
      });
  }

  onClose() {
    this.close.emit();
  }
}
