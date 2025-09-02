import { ChangeDetectorRef, Component, ViewChild, OnInit } from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertService } from '../../../../core/services/alert.service';
import {
  EquipmentService,
  NewAssetData,
} from '../../services/equipment.service';

@Component({
  selector: 'app-equipment',
  imports: [ImportsModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './equipment.component.html',
  styleUrl: './equipment.component.scss',
  styles: [
    `
      :host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
  ],
})
export class EquipmentComponent implements OnInit {
  assets: any[] = [];
  loading: boolean = false;
  error: string = '';
  showAddForm: boolean = false;
  addAssetForm: FormGroup;
  submitting: boolean = false;
  locations: any[] = [];
  suppliers: any[] = [];
  programs: any[] = [];
  dropdownsLoading: boolean = false;

  assetCategoryOptions = [
    { label: 'Hardware', value: 'hardware' },
    { label: 'Software', value: 'software' },
  ];

  // Table display properties
  showTableSection: boolean = false;
  showCategorySelection: boolean = false;
  selectedCategory: 'hardware' | 'software' | null = null;

  constructor(
    private messageService: MessageService,
    private equipmentService: EquipmentService,
    private fb: FormBuilder
  ) {
    this.addAssetForm = this.fb.group({
      asset_category: [null],
      asset_name: ['', Validators.required],
      property_number_id: ['', Validators.required],
      property_number: ['', Validators.required],
      foun_cluster: ['', Validators.required],
      PO_number: ['', Validators.required],
      purpose: ['', Validators.required],
      date_acquired: [null],
      issued_to: ['', Validators.required],
      Location: ['', Validators.required],
      Supplier: ['', Validators.required],
      Program: ['', Validators.required],
      is_active: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadDropdownData();
    this.testEndpoints();

    // Log current dropdown data state
    console.log('🔍 Component initialized with dropdown arrays:');
    console.log('📍 Locations array:', this.locations);
    console.log('🏢 Suppliers array:', this.suppliers);
    console.log('📚 Programs array:', this.programs);
  }

  /**
   * Enhanced method to test and debug the dropdown data loading
   */
  testDropdownDataStructure() {
    console.log('🧪 Testing dropdown data structure...');

    // Test locations
    if (this.locations && this.locations.length > 0) {
      console.log('� Sample location object:', this.locations[0]);
      console.log('📍 Location properties:', Object.keys(this.locations[0]));

      // Check if required properties exist
      const sampleLocation = this.locations[0];
      if (!sampleLocation.location_id) {
        console.warn('⚠️ Missing location_id property in location object');
      }
      if (!sampleLocation.location_name) {
        console.warn('⚠️ Missing location_name property in location object');
      }
    } else {
      console.warn('⚠️ No locations data available for structure test');
    }

    // Test suppliers
    if (this.suppliers && this.suppliers.length > 0) {
      console.log('🏢 Sample supplier object:', this.suppliers[0]);
      console.log('🏢 Supplier properties:', Object.keys(this.suppliers[0]));

      // Check if required properties exist
      const sampleSupplier = this.suppliers[0];
      if (!sampleSupplier.supplier_id) {
        console.warn('⚠️ Missing supplier_id property in supplier object');
      }
      if (!sampleSupplier.supplier_name) {
        console.warn('⚠️ Missing supplier_name property in supplier object');
      }
    } else {
      console.warn('⚠️ No suppliers data available for structure test');
    }

    // Test programs
    if (this.programs && this.programs.length > 0) {
      console.log('📚 Sample program object:', this.programs[0]);
      console.log('📚 Program properties:', Object.keys(this.programs[0]));

      // Check if required properties exist
      const sampleProgram = this.programs[0];
      if (!sampleProgram.program_id) {
        console.warn('⚠️ Missing program_id property in program object');
      }
      if (!sampleProgram.program_name) {
        console.warn('⚠️ Missing program_name property in program object');
      }
    } else {
      console.warn('⚠️ No programs data available for structure test');
    }
  }

  loadDropdownData() {
    this.dropdownsLoading = true;
    console.log('🔄 Starting to load dropdown data...');

    // Load locations
    this.equipmentService.getLocations().subscribe({
      next: (locations) => {
        console.log('📍 Raw locations response:', locations);
        // Use all locations since API doesn't return is_active property
        this.locations = locations || [];
        console.log('📍 Locations loaded for dropdown:', this.locations);
        console.log('📍 Total locations available:', this.locations.length);
      },
      error: (error) => {
        console.error('❌ Error loading locations:', error);
        this.locations = []; // Ensure empty array on error
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Failed to load locations',
        });
      },
    });

    // Load suppliers
    this.equipmentService.getSuppliers().subscribe({
      next: (suppliers) => {
        console.log('🏢 Raw suppliers response:', suppliers);
        // Use all suppliers since API doesn't return is_active property
        this.suppliers = suppliers || [];
        console.log('🏢 Suppliers loaded for dropdown:', this.suppliers);
        console.log('🏢 Total suppliers available:', this.suppliers.length);
      },
      error: (error) => {
        console.error('❌ Error loading suppliers:', error);
        this.suppliers = []; // Ensure empty array on error
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Failed to load suppliers',
        });
      },
    });

    // Load programs
    this.equipmentService.getPrograms().subscribe({
      next: (programs) => {
        console.log('📚 Raw programs response:', programs);
        // Use all programs since API doesn't return is_active property
        this.programs = programs || [];
        console.log('📚 Programs loaded for dropdown:', this.programs);
        console.log('📚 Total programs available:', this.programs.length);
        this.dropdownsLoading = false;
      },
      error: (error) => {
        console.error('❌ Error loading programs:', error);
        this.programs = []; // Ensure empty array on error
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Failed to load programs',
        });
        this.dropdownsLoading = false;
      },
    });
  }

  /**
   * Manual method to reload dropdown data - useful for debugging
   */
  reloadDropdownData() {
    console.log('🔄 Manually reloading dropdown data...');
    this.locations = [];
    this.suppliers = [];
    this.programs = [];
    this.loadDropdownData();

    // Test data structure after a delay to allow API calls to complete
    setTimeout(() => {
      this.testDropdownDataStructure();
    }, 2000);
  }

  /**
   * Test the new API endpoints
   */
  testEndpoints() {
    console.log('🧪 Testing new endpoints...');

    this.equipmentService.testNewEndpoints().subscribe({
      next: (results) => {
        console.log('🧪 Test Results:', results);

        if (results.errors.length === 0) {
          this.messageService.add({
            severity: 'success',
            summary: 'API Test Success',
            detail: `All endpoints working! Locations: ${
              results.locations?.length || 0
            }, Suppliers: ${results.suppliers?.length || 0}, Programs: ${
              results.programs?.length || 0
            }`,
          });
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'API Test Partial Success',
            detail: `${
              3 - results.errors.length
            }/3 endpoints working. Check console for details.`,
          });
        }
      },
      error: (error) => {
        console.error('❌ Test failed:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'API Test Failed',
          detail: 'Failed to test endpoints. Check console for details.',
        });
      },
    });
  }

  /**
   * Manual test button method
   */
  runEndpointTests() {
    this.testEndpoints();
  }

  /**
   * Show the Add Asset form
   */
  showAddAssetForm() {
    this.showAddForm = true;
  }

  /**
   * Hide the Add Asset form
   */
  hideAddAssetForm() {
    this.showAddForm = false;
    this.addAssetForm.reset();
  }

  /**
   * Submit the Add Asset form
   */
  onSubmitAddAsset() {
    if (this.addAssetForm.valid) {
      this.submitting = true;

      const assetData: NewAssetData = this.addAssetForm.value;

      // Format date_acquired to YYYY-MM-DD format if it exists
      if (assetData.date_acquired) {
        const date = new Date(assetData.date_acquired);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        assetData.date_acquired = `${year}-${month}-${day}`;
        console.log('📅 Formatted date_acquired:', assetData.date_acquired);
      }

      // Enhanced logging to show the IDs being passed
      console.log('📝 Submitting asset data:', assetData);
      console.log('🔍 Values being sent to database:');
      console.log('  🏷️ Asset Category:', assetData.asset_category);
      console.log('  📍 Location ID:', assetData.Location);
      console.log('  🏢 Supplier ID:', assetData.Supplier);
      console.log('  📚 Program ID:', assetData.Program);

      // Validate that we have valid UUIDs for foreign key fields
      const errors: string[] = [];

      if (assetData.Location && !this.isValidUUID(assetData.Location)) {
        errors.push(`Location ID is not a valid UUID: ${assetData.Location}`);
      }

      if (assetData.Supplier && !this.isValidUUID(assetData.Supplier)) {
        errors.push(`Supplier ID is not a valid UUID: ${assetData.Supplier}`);
      }

      if (assetData.Program && !this.isValidUUID(assetData.Program)) {
        errors.push(`Program ID is not a valid UUID: ${assetData.Program}`);
      }

      if (errors.length > 0) {
        console.error('❌ Validation errors:', errors);
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'Some fields have invalid values. Check console for details.',
        });
        this.submitting = false;
        return;
      }

      // Show which names correspond to these IDs
      if (assetData.Location) {
        const selectedLocation = this.locations.find(
          (loc) => loc.location_id === assetData.Location
        );
        console.log('  📍 Location Name:', selectedLocation?.location_name);
      }

      if (assetData.Supplier) {
        const selectedSupplier = this.suppliers.find(
          (sup) => sup.supplier_id === assetData.Supplier
        );
        console.log('  🏢 Supplier Name:', selectedSupplier?.supplier_name);
      }

      if (assetData.Program) {
        const selectedProgram = this.programs.find(
          (prog) => prog.program_id === assetData.Program
        );
        console.log('  📚 Program Name:', selectedProgram?.program_name);
      }

      this.equipmentService.createAsset(assetData).subscribe({
        next: (response) => {
          console.log('✅ Asset created successfully:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Asset created successfully!',
          });
          this.hideAddAssetForm();
          this.loadAssets(); // Reload the assets list
        },
        error: (error) => {
          console.error('❌ Error creating asset:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create asset. Please try again.',
          });
        },
        complete: () => {
          this.submitting = false;
        },
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all required fields.',
      });
    }
  }

  /**
   * Load all assets
   */
  loadAssets() {
    this.loading = true;
    this.equipmentService.getAssets().subscribe({
      next: (assets) => {
        this.assets = assets;
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error loading assets:', error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load assets.',
        });
      },
    });
  }

  /**
   * Validate if a string is a valid UUID
   */
  private isValidUUID(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Show the table and load assets
   */
  showTable() {
    this.showTableSection = true;
    this.loadAssets();
  }

  onShowAsset(asset: any) {
    this.messageService.add({
      severity: 'info',
      summary: 'Show Asset',
      detail: `Showing asset: ${asset.asset_name}`,
    });
    // TODO: Implement modal or navigation for asset details
  }

  onEditAsset(asset: any) {
    this.messageService.add({
      severity: 'info',
      summary: 'Edit Asset',
      detail: `Editing asset: ${asset.asset_name}`,
    });
    // TODO: Implement edit form/modal
  }

  onArchiveAsset(asset: any) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Archive Asset',
      detail: `Archiving asset: ${asset.asset_name}`,
    });
    // TODO: Implement archive logic
  }
}
