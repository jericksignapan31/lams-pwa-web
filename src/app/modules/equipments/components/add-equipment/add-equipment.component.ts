import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { EquipmentService } from '../../services/equipment.service';
import { MessageService } from 'primeng/api';

interface AssetType {
  asset_type_id: string;
  asset_type_name: string;
}

interface HardwareForm {
  hardware_name: string;
  brand_name: string;
  model: string;
  serial_number: string;
  date_acquired: Date | null;
  unit_cost: number | null;
  color: string;
  height: number | null;
  width: number | null;
  length: number | null;
  weight: number | null;
  package_material: string;
  package_color: string;
  estimated_useful_life: number | null;
  laboratory: string | null;
}

interface SoftwareForm {
  software_name: string;
  version: string;
  license_key: string;
  license_count: number | null;
  vendor: string;
  license_expiry_date: Date | null;
  assigned_to: string;
  date_acquired: Date | null;
  unit_cost: number | null;
  laboratory: string | null;
}

@Component({
  selector: 'app-add-equipment',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './add-equipment.component.html',
  styleUrl: './add-equipment.component.scss',
})
export class AddEquipmentComponent implements OnInit {
  @Output() cancel = new EventEmitter<void>();
  @Output() equipmentAdded = new EventEmitter<any>();

  assetTypes: AssetType[] = [
    {
      asset_type_id: '3660f0bc-ba67-4a73-b121-2dc76a10248a',
      asset_type_name: 'Hardware',
    },
    {
      asset_type_id: 'bfe46b46-f97f-43a5-9683-d4cc357ff143',
      asset_type_name: 'Software',
    },
  ];

  selectedAssetType: AssetType | null = null;
  hardwareForm!: FormGroup;
  softwareForm!: FormGroup;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private equipmentService: EquipmentService,
    private messageService: MessageService
  ) {
    this.initializeForms();
  }

  ngOnInit() {
    // Component initialization
  }

  private initializeForms() {
    // Initialize Hardware Form
    this.hardwareForm = this.fb.group({
      hardware_name: ['', Validators.required],
      brand_name: ['', Validators.required],
      model: ['', Validators.required],
      serial_number: ['', Validators.required],
      date_acquired: [null],
      unit_cost: [null, [Validators.min(0)]],
      color: [''],
      height: [null, [Validators.min(0)]],
      width: [null, [Validators.min(0)]],
      length: [null, [Validators.min(0)]],
      weight: [null, [Validators.min(0)]],
      package_material: [''],
      package_color: [''],
      estimated_useful_life: [null, [Validators.min(1)]],
      laboratory: [null],
    });

    // Initialize Software Form
    this.softwareForm = this.fb.group({
      software_name: ['', Validators.required],
      version: ['', Validators.required],
      license_key: [''],
      license_count: [null, [Validators.min(1)]],
      vendor: ['', Validators.required],
      license_expiry_date: [null],
      assigned_to: [''],
      date_acquired: [null],
      unit_cost: [null, [Validators.min(0)]],
      laboratory: [null],
    });
  }

  selectAssetType(assetType: AssetType) {
    this.selectedAssetType = assetType;
  }

  onCancel() {
    this.cancel.emit();
  }

  onSubmit() {
    if (!this.selectedAssetType) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select an asset type',
      });
      return;
    }

    const currentForm =
      this.selectedAssetType.asset_type_name === 'Hardware'
        ? this.hardwareForm
        : this.softwareForm;

    if (currentForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all required fields',
      });
      return;
    }

    this.isSubmitting = true;
    const formData = {
      ...currentForm.value,
      asset_type_id: this.selectedAssetType.asset_type_id,
    };

    // Here you would call your API service
    console.log('Submitting form data:', formData);

    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      this.equipmentAdded.emit(formData);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `${this.selectedAssetType?.asset_type_name} equipment added successfully!`,
      });
    }, 1000);
  }

  goBack() {
    this.selectedAssetType = null;
  }
}
