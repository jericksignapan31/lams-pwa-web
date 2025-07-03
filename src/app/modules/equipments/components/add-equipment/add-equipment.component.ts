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
  HardwareAssetType,
  AssetType,
  ASSET_TYPES,
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

    console.log('🔧 Loading asset types...');
    this.loadAssetTypes();
    console.log('🏢 Loading laboratories...');
    this.loadLaboratories();
    console.log('💻 Loading hardware types...');
    this.loadHardwareTypes();
    console.log('✅ All loading methods called');
  }

  private initializeForms() {
    // Initialize Hardware Form
    this.hardwareForm = this.fb.group({
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
    });
  }

  /**
   * Load asset types from the service
   */
  loadAssetTypes() {
    console.log('🔄 Starting to load asset types...');
    this.loadingAssetTypes = true;

    // Try with fallback first
    this.equipmentService.getAssetTypesWithFallback().subscribe({
      next: (response) => {
        console.log('✅ Asset types loaded successfully:', response);
        console.log(
          '📊 Number of asset types received:',
          response?.length || 0
        );
        console.log(
          '📋 Asset types details:',
          JSON.stringify(response, null, 2)
        );
        this.assetTypes = response || [];
        this.loadingAssetTypes = false;
        console.log(
          '✅ Asset types loading completed. Current assetTypes array:',
          this.assetTypes
        );
      },
      error: (error) => {
        console.error('❌ Even fallback failed:', error);
        console.error('❌ Error status:', error.status);
        console.error('❌ Error message:', error.message);
        console.error('❌ Full error object:', JSON.stringify(error, null, 2));
        this.loadingAssetTypes = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load asset types. Please refresh the page.',
        });
      },
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

  /**
   * Load hardware types from the service
   */
  loadHardwareTypes() {
    this.loadingHardwareTypes = true;
    this.equipmentService.getHardwareAssetTypes().subscribe({
      next: (response) => {
        console.log('✅ Hardware asset types loaded:', response);
        // Map the API response to our local HardwareType interface with icons
        this.hardwareTypes = response.map((type) => ({
          hardware_asset_type_id: type.hardware_asset_type_id,
          type_name: type.type_name,
          icon: this.getIconForHardwareType(type.type_name),
        }));
        this.loadingHardwareTypes = false;
      },
      error: (error) => {
        console.error('❌ Error loading hardware types:', error);
        this.loadingHardwareTypes = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load hardware types. Please refresh the page.',
        });
      },
    });
  }

  /**
   * Get appropriate icon for hardware type
   */
  private getIconForHardwareType(typeName: string): string {
    const iconMap: { [key: string]: string } = {
      'Desktop Computer': 'pi pi-desktop',
      Laptop: 'pi pi-tablet',
      Keyboard: 'pi pi-bars',
      Monitor: 'pi pi-window-maximize',
      Mouse: 'pi pi-circle',
      Printer: 'pi pi-print',
    };
    return iconMap[typeName] || 'pi pi-box';
  }

  selectAssetType(assetType: AssetType) {
    console.log('🎯 Asset type selected:', assetType);
    console.log('🏷️ Asset type name:', assetType.asset_type_name);
    console.log('🆔 Asset type ID:', assetType.asset_type_id);

    this.selectedAssetType = assetType;
    // Reset hardware type selection when changing asset type
    this.selectedHardwareType = null;
    if (this.hardwareForm) {
      this.hardwareForm.patchValue({ hardware_type: '' });
      console.log('🔄 Hardware form reset due to asset type change');
    }

    console.log(
      '✅ Asset type selection completed. Selected:',
      this.selectedAssetType?.asset_type_name
    );
  }

  selectHardwareType(hardwareType: HardwareType) {
    this.selectedHardwareType = hardwareType;
    if (this.hardwareForm) {
      this.hardwareForm.patchValue({
        hardware_type: hardwareType.hardware_asset_type_id,
      });
    }
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

    // Additional validation for hardware type selection
    if (
      this.selectedAssetType.asset_type_name === 'Hardware' &&
      !this.selectedHardwareType
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select a hardware type',
      });
      return;
    }

    const currentForm =
      this.selectedAssetType.asset_type_name === 'Hardware'
        ? this.hardwareForm
        : this.softwareForm;

    if (currentForm.invalid) {
      // Mark all fields as touched to show validation errors
      currentForm.markAllAsTouched();

      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all required fields',
      });
      return;
    }

    this.isSubmitting = true;

    console.log('🔧 Submitting form data:', currentForm.value);
    console.log('🔧 Selected hardware type:', this.selectedHardwareType);

    // Create properly typed data objects and call the appropriate enhanced API
    const hardwareData =
      this.selectedAssetType.asset_type_name === 'Hardware'
        ? this.createHardwareData(currentForm.value)
        : null;

    const softwareData =
      this.selectedAssetType.asset_type_name === 'Software'
        ? this.createSoftwareData(currentForm.value)
        : null;

    console.log('🔧 Hardware data to send:', hardwareData);
    console.log('💻 Software data to send:', softwareData);

    const apiCall =
      this.selectedAssetType.asset_type_name === 'Hardware'
        ? this.equipmentService.addHardwareEquipment(
            this.selectedAssetType.asset_type_id,
            hardwareData!
          )
        : this.equipmentService.addSoftwareEquipment(
            this.selectedAssetType.asset_type_id,
            softwareData!
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
        console.error('❌ Error details:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message: error.message,
        });

        this.isSubmitting = false;

        let errorMessage = `Failed to create ${this.selectedAssetType?.asset_type_name} equipment. Please try again.`;

        if (error.error && typeof error.error === 'object') {
          const validationErrors = [];
          for (const [field, messages] of Object.entries(error.error)) {
            if (Array.isArray(messages)) {
              validationErrors.push(`${field}: ${messages.join(', ')}`);
            } else {
              validationErrors.push(`${field}: ${messages}`);
            }
          }

          if (validationErrors.length > 0) {
            errorMessage = `Validation errors: ${validationErrors.join('; ')}`;
          }
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
        });
      },
    });
  }

  goBack() {
    if (
      this.selectedHardwareType &&
      this.selectedAssetType?.asset_type_name === 'Hardware'
    ) {
      this.selectedHardwareType = null;
      this.hardwareForm.patchValue({ hardware_type: '' });
    } else {
      this.selectedAssetType = null;
      this.selectedHardwareType = null;
    }
  }

  /**
   * Debug method to check current component state
   * Call this from browser console: window.addEquipmentComponent.debugState()
   */
  debugState() {
    console.log('🐛 DEBUG STATE - AddEquipmentComponent');
    console.log('📊 Asset Types:', this.assetTypes);
    console.log('📊 Asset Types Count:', this.assetTypes.length);
    console.log('⏳ Loading Asset Types:', this.loadingAssetTypes);
    console.log('🎯 Selected Asset Type:', this.selectedAssetType);
    console.log('💻 Hardware Types:', this.hardwareTypes);
    console.log('💻 Hardware Types Count:', this.hardwareTypes.length);
    console.log('⏳ Loading Hardware Types:', this.loadingHardwareTypes);
    console.log('🎯 Selected Hardware Type:', this.selectedHardwareType);
    console.log('🏢 Laboratories:', this.laboratories);
    console.log('🏢 Laboratories Count:', this.laboratories.length);
    console.log('⏳ Loading Laboratories:', this.loadingLaboratories);
    return {
      assetTypes: this.assetTypes,
      loadingAssetTypes: this.loadingAssetTypes,
      selectedAssetType: this.selectedAssetType,
      hardwareTypes: this.hardwareTypes,
      loadingHardwareTypes: this.loadingHardwareTypes,
      selectedHardwareType: this.selectedHardwareType,
      laboratories: this.laboratories,
      loadingLaboratories: this.loadingLaboratories,
    };
  }

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
      // Map hardware_type to hardware_asset_type for API compatibility
      hardware_asset_type: formValue.hardware_type || '',
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
