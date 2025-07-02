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
import {
  EquipmentService,
  HardwareEquipmentData,
  SoftwareEquipmentData,
  ASSET_TYPES,
} from '../../services/equipment.service';
import { LaboratoryService } from '../../../laboratory/services/laboratory.service';
import { MessageService } from 'primeng/api';

interface AssetType {
  asset_type_id: string;
  asset_type_name: string;
}

interface Laboratory {
  laboratory_id: string;
  laboratory_name: string;
  location: string;
  campus: string;
  room_no: string;
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
      asset_type_id: ASSET_TYPES.HARDWARE,
      asset_type_name: 'Hardware',
    },
    {
      asset_type_id: ASSET_TYPES.SOFTWARE,
      asset_type_name: 'Software',
    },
  ];

  selectedAssetType: AssetType | null = null;
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
    this.loadLaboratories();
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
    });
  }

  /**
   * Load laboratories from the service
   */
  loadLaboratories() {
    this.loadingLaboratories = true;
    this.laboratoryService.getLaboratories().subscribe({
      next: (response) => {
        console.log('✅ Laboratories loaded:', response);
        this.laboratories = response || [];
        this.loadingLaboratories = false;
      },
      error: (error) => {
        console.error('❌ Error loading laboratories:', error);
        this.loadingLaboratories = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load laboratories. Please refresh the page.',
        });
      },
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

    console.log('Submitting form data:', currentForm.value);

    // Create properly typed data objects and call the appropriate enhanced API
    const apiCall =
      this.selectedAssetType.asset_type_name === 'Hardware'
        ? this.equipmentService.addHardwareEquipment(
            this.selectedAssetType.asset_type_id,
            this.createHardwareData(currentForm.value)
          )
        : this.equipmentService.addSoftwareEquipment(
            this.selectedAssetType.asset_type_id,
            this.createSoftwareData(currentForm.value)
          );

    apiCall.subscribe({
      next: (response) => {
        console.log('✅ Equipment created successfully:', response);
        this.isSubmitting = false;
        this.equipmentAdded.emit(response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${this.selectedAssetType?.asset_type_name} equipment added successfully!`,
        });
        // Reset the form
        currentForm.reset();
      },
      error: (error) => {
        console.error('❌ Error creating equipment:', error);
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            error.error?.message ||
            `Failed to create ${this.selectedAssetType?.asset_type_name} equipment. Please try again.`,
        });
      },
    });
  }

  goBack() {
    this.selectedAssetType = null;
  }

  /**
   * Get the selected laboratory object for display
   */
  getSelectedLaboratory(laboratoryId: string): Laboratory | undefined {
    return this.laboratories.find((lab) => lab.laboratory_id === laboratoryId);
  }

  /**
   * Create a properly typed hardware data object from form
   */
  private createHardwareData(formValue: any): HardwareEquipmentData {
    return {
      hardware_name: formValue.hardware_name || '',
      brand_name: formValue.brand_name || '',
      model: formValue.model || '',
      serial_number: formValue.serial_number || '',
      date_acquired: formValue.date_acquired || null,
      unit_cost: formValue.unit_cost || null,
      color: formValue.color || '',
      height: formValue.height || null,
      width: formValue.width || null,
      length: formValue.length || null,
      weight: formValue.weight || null,
      package_material: formValue.package_material || '',
      package_color: formValue.package_color || '',
      estimated_useful_life: formValue.estimated_useful_life || null,
      laboratory: formValue.laboratory || null,
    };
  }

  /**
   * Create a properly typed software data object from form
   */
  private createSoftwareData(formValue: any): SoftwareEquipmentData {
    return {
      software_name: formValue.software_name || '',
      version: formValue.version || '',
      license_key: formValue.license_key || '',
      license_count: formValue.license_count || null,
      vendor: formValue.vendor || '',
      license_expiry_date: formValue.license_expiry_date || null,
      assigned_to: formValue.assigned_to || '',
      date_acquired: formValue.date_acquired || null,
      unit_cost: formValue.unit_cost || null,
      laboratory: formValue.laboratory || null,
    };
  }
}
