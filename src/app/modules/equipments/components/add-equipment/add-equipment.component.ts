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
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import {
  EquipmentService,
  HardwareEquipmentData,
  SoftwareEquipmentData,
  HardwareAssetType,
  AssetType,
} from '../../services/equipment.service';
import { LaboratoryService } from '../../../laboratory/services/laboratory.service';
import { MessageService } from 'primeng/api';

interface HardwareType {
  hardware_asset_type_id: string;
  type_name: string;
  icon: string;
}

interface Laboratory {
  laboratory_id: string;
  laboratory_name: string;
  location: string;
  campus: string;
  room_no: string;
}

interface HardwareForm {
  hardware_type: string;
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
  hardware_asset_types: string[]; // Multiple hardware asset type IDs
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
    MultiSelectModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './add-equipment.component.html',
  styleUrl: './add-equipment.component.scss',
})
export class AddEquipmentComponent implements OnInit {
  @Output() cancel = new EventEmitter<void>();
  @Output() equipmentAdded = new EventEmitter<any>();

  assetTypes: AssetType[] = [];
  loadingAssetTypes: boolean = false;

  hardwareTypes: HardwareType[] = [];
  loadingHardwareTypes: boolean = false;

  selectedAssetType: AssetType | null = null;
  selectedHardwareType: HardwareType | null = null;
  hardwareForm!: FormGroup;
  softwareForm!: FormGroup;
  isSubmitting: boolean = false;
  laboratories: Laboratory[] = [];
  loadingLaboratories: boolean = false;

  constructor(
    private fb: FormBuilder,
    private equipmentService: EquipmentService,
    private laboratoryService: LaboratoryService,
    private messageService: MessageService
  ) {
    this.initializeForms();
  }

  ngOnInit() {
    console.log('🚀 AddEquipmentComponent - ngOnInit started');

    // Make component available for debugging
    if (typeof window !== 'undefined') {
      (window as any).addEquipmentComponent = this;
      console.log(
        '🐛 Component available for debugging: window.addEquipmentComponent'
      );
    }
  }

  onSubmit() {
    if (this.selectedAssetType?.asset_type_name === 'Hardware') {
      if (this.hardwareForm.invalid) {
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid Form',
          detail: 'Please fill all required hardware fields.',
        });
        return;
      }
      this.isSubmitting = true;
      this.equipmentService.createAsset(this.hardwareForm.value).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Hardware Added',
            detail: 'Hardware equipment successfully added.',
          });
          this.equipmentAdded.emit(res);
          this.isSubmitting = false;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add hardware equipment.',
          });
          this.isSubmitting = false;
        },
      });
    } else if (this.selectedAssetType?.asset_type_name === 'Software') {
      if (this.softwareForm.invalid) {
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid Form',
          detail: 'Please fill all required software fields.',
        });
        return;
      }
      this.isSubmitting = true;
      this.equipmentService.createAsset(this.softwareForm.value).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Software Added',
            detail: 'Software equipment successfully added.',
          });
          this.equipmentAdded.emit(res);
          this.isSubmitting = false;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add software equipment.',
          });
          this.isSubmitting = false;
        },
      });
    }
  }
  private initializeForms() {
    // Initialize Hardware Form
    this.hardwareForm = this.fb.group({
      property_number_id: ['', Validators.required],
      hardware_type: ['', Validators.required],
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
      laboratory: [null, Validators.required],
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
      laboratory: [null, Validators.required],
      hardware_asset_types: [[], Validators.required], // Multiple selection, required
    });

    if (this.selectedAssetType?.asset_type_name === 'Hardware') {
      if (this.hardwareForm.invalid) {
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid Form',
          detail: 'Please fill all required hardware fields.',
        });
        return;
      }
      this.isSubmitting = true;
      this.equipmentService.createAsset(this.hardwareForm.value).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Hardware Added',
            detail: 'Hardware equipment successfully added.',
          });
          this.equipmentAdded.emit(res);
          this.isSubmitting = false;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add hardware equipment.',
          });
          this.isSubmitting = false;
        },
      });
    } else if (this.selectedAssetType?.asset_type_name === 'Software') {
      if (this.softwareForm.invalid) {
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid Form',
          detail: 'Please fill all required software fields.',
        });
        return;
      }
      this.isSubmitting = true;
      this.equipmentService.createAsset(this.softwareForm.value).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Software Added',
            detail: 'Software equipment successfully added.',
          });
          this.equipmentAdded.emit(res);
          this.isSubmitting = false;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add software equipment.',
          });
          this.isSubmitting = false;
        },
      });
    }
  }
}
