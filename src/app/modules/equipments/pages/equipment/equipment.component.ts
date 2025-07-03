import { ChangeDetectorRef, Component, ViewChild, OnInit } from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  Product,
  Equipment,
  EquipmentForm,
  Laboratory,
} from '../../model/product';
import { Table } from 'primeng/table';
import {
  EquipmentService,
  ASSET_TYPES,
  AssetType,
} from '../../services/equipment.service';
import { LaboratoryService } from '../../../laboratory/services/laboratory.service';
import { AlertService } from '../../../../core/services/alert.service';
import { AddEquipmentComponent } from '../../components/add-equipment/add-equipment.component';
import { HardwareTableComponent } from '../../components/hardware-table/hardware-table.component';
import { SoftwareTableComponent } from '../../components/software-table/software-table.component';

@Component({
  selector: 'app-equipment',
  imports: [
    ImportsModule,
    AddEquipmentComponent,
    HardwareTableComponent,
    SoftwareTableComponent,
  ],
  providers: [MessageService, ConfirmationService, EquipmentService],
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

  // Asset types from API
  assetTypes: AssetType[] = [];
  hardwareAssetType: AssetType | null = null;
  softwareAssetType: AssetType | null = null;
  loadingAssetTypes: boolean = false;

  // Table display properties
  showTableSection: boolean = false;
  showCategorySelection: boolean = false;
  selectedCategory: 'hardware' | 'software' | null = null;

  constructor(
    private alertService: AlertService,
    private equipmentService: EquipmentService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // Load asset types first, then load equipment data
    this.loadAssetTypes();
  }

  /**
   * Load asset types from API
   */
  loadAssetTypes() {
    this.loadingAssetTypes = true;
    console.log('🔄 Loading asset types...');

    this.equipmentService.getAssetTypesWithFallback().subscribe({
      next: (assetTypes) => {
        console.log('✅ Asset types loaded:', assetTypes);
        this.assetTypes = assetTypes;
        
        // Find Hardware and Software asset types
        this.hardwareAssetType = assetTypes.find(
          type => type.asset_type_name.toLowerCase() === 'hardware'
        ) || null;
        
        this.softwareAssetType = assetTypes.find(
          type => type.asset_type_name.toLowerCase() === 'software'
        ) || null;

        console.log('🔧 Hardware Asset Type:', this.hardwareAssetType);
        console.log('💻 Software Asset Type:', this.softwareAssetType);

        this.loadingAssetTypes = false;

        // Now load equipment data with correct asset type IDs
        this.loadAndConsoleLogEquipmentData();
      },
      error: (error) => {
        console.error('❌ Error loading asset types:', error);
        this.loadingAssetTypes = false;
        
        // Fallback to hardcoded asset types if API fails
        console.log('🔄 Using fallback asset type IDs...');
        this.loadAndConsoleLogEquipmentData();
      }
    });
  }

  /**
   * Load and console log both hardware and software data
   */
  loadAndConsoleLogEquipmentData() {
    console.log('🔧 Loading Equipment Data...');
    console.log('🔧 Hardware Asset Type ID:', ASSET_TYPES.HARDWARE);
    console.log('💻 Software Asset Type ID:', ASSET_TYPES.SOFTWARE);

    // Load Hardware Data
    this.loadHardwareData();

    // Load Software Data
    this.loadSoftwareData();
  }

  /**
   * Load and console log hardware equipment data
   */
  loadHardwareData() {
    const hardwareAssetTypeId = this.hardwareAssetType?.asset_type_id || ASSET_TYPES.HARDWARE;
    
    console.log('🔧 Fetching Hardware Equipment...');
    console.log('🔧 Using Hardware Asset Type ID:', hardwareAssetTypeId);

    this.equipmentService.getHardwares(hardwareAssetTypeId).subscribe({
      next: (hardwareData) => {
        console.log('🔧 ===== HARDWARE EQUIPMENT DATA =====');
        console.log('🔧 Total Hardware Items:', hardwareData.length);
        console.log('🔧 Hardware Data:', hardwareData);

        // Log each hardware item individually
        hardwareData.forEach((item, index) => {
          console.log(`🔧 Hardware Item ${index + 1}:`, {
            name: item.hardware_name,
            brand: item.brand_name,
            model: item.model,
            serial: item.serial_number,
            cost: item.unit_cost,
            laboratory: item.laboratory_name || item.laboratory,
            campus: item.campus,
            ...item,
          });
        });
        console.log('🔧 ================================');
      },
      error: (error) => {
        console.error('❌ Error loading hardware data:', error);
        console.error('❌ Hardware API Error Details:', {
          message: error.message,
          status: error.status,
          error: error.error,
        });
      },
    });
  }

  /**
   * Load and console log software equipment data
   */
  loadSoftwareData() {
    const softwareAssetTypeId = this.softwareAssetType?.asset_type_id || ASSET_TYPES.SOFTWARE;
    
    console.log('💻 Fetching Software Equipment...');
    console.log('💻 Using Software Asset Type ID:', softwareAssetTypeId);

    this.equipmentService.getSoftwares(softwareAssetTypeId).subscribe({
      next: (softwareData) => {
        console.log('💻 ===== SOFTWARE EQUIPMENT DATA =====');
        console.log('💻 Total Software Items:', softwareData.length);
        console.log('💻 Software Data:', softwareData);

        // Log each software item individually
        softwareData.forEach((item, index) => {
          console.log(`💻 Software Item ${index + 1}:`, {
            name: item.software_name,
            version: item.version,
            vendor: item.vendor,
            license: item.license_key,
            expiry: item.license_expiry_date,
            cost: item.unit_cost,
            laboratory: item.laboratory_name || item.laboratory,
            campus: item.campus,
            ...item,
          });
        });
        console.log('💻 ================================');
      },
      error: (error) => {
        console.error('❌ Error loading software data:', error);
        console.error('❌ Software API Error Details:', {
          message: error.message,
          status: error.status,
          error: error.error,
        });
      },
    });
  }

  /**
   * Test method to call getAssets from EquipmentService
   */

  /**
   * Manual trigger for testing (called from template)
   */

  /**
   * Get columns for assets table display
   */
  getAssetColumns(): string[] {
    if (this.assets.length === 0) return [];

    // Get all unique keys from the first asset object
    const firstAsset = this.assets[0];
    return Object.keys(firstAsset);
  }

  /**
   * Get value from asset object for display
   */
  getAssetValue(asset: any, column: string): any {
    const value = asset[column];
    // Handle complex objects by converting to string
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return value || '-';
  }

  /**
   * Show add equipment form
   */
  showAddEquipment() {
    this.showAddForm = true;
  }

  /**
   * Hide add equipment form
   */
  hideAddEquipment() {
    this.showAddForm = false;
  }

  /**
   * Handle equipment added event
   */
  onEquipmentAdded(equipment: any) {
    this.showAddForm = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Equipment added successfully!',
    });
  }

  /**
   * Show table section with category selection
   */
  showTable() {
    this.showTableSection = true;
    this.showCategorySelection = true;
    this.selectedCategory = null;

    // Console log equipment data when showing tables
    console.log('🔍 Show Table button clicked - Loading equipment data...');
    this.loadAndConsoleLogEquipmentData();
  }

  /**
   * Hide table section
   */
  hideTable() {
    this.showTableSection = false;
    this.showCategorySelection = false;
    this.selectedCategory = null;
  }

  /**
   * Select category and show corresponding table
   */
  selectCategory(category: 'hardware' | 'software') {
    console.log('🎯 Category selected:', category);
    
    if (category === 'hardware') {
      const hardwareAssetId = this.hardwareAssetType?.asset_type_id || 'hardware-mock-id';
      console.log('🔧 Hardware Asset Type ID to be used:', hardwareAssetId);
      console.log('🔧 This will call API endpoint: GET /api/assets/' + hardwareAssetId + '/hardwares/');
    } else if (category === 'software') {
      const softwareAssetId = this.softwareAssetType?.asset_type_id || 'software-mock-id';
      console.log('💻 Software Asset Type ID to be used:', softwareAssetId);
      console.log('💻 This will call API endpoint: GET /api/assets/' + softwareAssetId + '/softwares/');
    }
    
    this.selectedCategory = category;
    this.showCategorySelection = false;
  }

  /**
   * Go back to category selection
   */
  backToCategorySelection() {
    this.showCategorySelection = true;
    this.selectedCategory = null;
  }

  /**
   * Manual trigger for refreshing equipment data (can be called from browser console)
   */
  refreshEquipmentConsoleData() {
    console.clear(); // Clear previous logs
    console.log('🔄 Manually refreshing equipment data...');
    this.loadAndConsoleLogEquipmentData();
  }

  /**
   * Get combined equipment data as a single object (useful for debugging)
   */
  async getAllEquipmentDataAsPromise() {
    try {
      const [hardwareData, softwareData] = await Promise.all([
        this.equipmentService.getHardwares(ASSET_TYPES.HARDWARE).toPromise(),
        this.equipmentService.getSoftwares(ASSET_TYPES.SOFTWARE).toPromise(),
      ]);

      const combinedData = {
        hardware: hardwareData || [],
        software: softwareData || [],
        summary: {
          totalHardware: (hardwareData || []).length,
          totalSoftware: (softwareData || []).length,
          totalEquipment:
            (hardwareData || []).length + (softwareData || []).length,
        },
      };

      console.log('📊 ===== COMBINED EQUIPMENT DATA =====');
      console.log('📊 Combined Equipment Data:', combinedData);
      console.log('📊 Summary:', combinedData.summary);
      console.log('📊 ===================================');

      return combinedData;
    } catch (error) {
      console.error('❌ Error getting combined equipment data:', error);
      return null;
    }
  }

  /**
   * Debug method to check current asset type setup
   * Call this from browser console: $0.debugAssetTypes()
   */
  debugAssetTypes() {
    console.log('🔍 ===== ASSET TYPE DEBUG INFO =====');
    console.log('🔍 Hardware Asset Type:', this.hardwareAssetType);
    console.log('🔍 Software Asset Type:', this.softwareAssetType);
    console.log('🔍 Hardware Asset Type ID:', this.hardwareAssetType?.asset_type_id || 'hardware-mock-id');
    console.log('🔍 Software Asset Type ID:', this.softwareAssetType?.asset_type_id || 'software-mock-id');
    console.log('🔍 Current Selected Category:', this.selectedCategory);
    console.log('🔍 Show Table Section:', this.showTableSection);
    console.log('🔍 Show Category Selection:', this.showCategorySelection);
    console.log('🔍 ===================================');
    
    // Also test API calls
    if (this.hardwareAssetType?.asset_type_id) {
      console.log('🔧 Testing Hardware API call with ID:', this.hardwareAssetType.asset_type_id);
      this.equipmentService.getHardwares(this.hardwareAssetType.asset_type_id).subscribe({
        next: (data) => console.log('✅ Hardware API Response:', data),
        error: (error) => console.error('❌ Hardware API Error:', error)
      });
    }
    
    if (this.softwareAssetType?.asset_type_id) {
      console.log('💻 Testing Software API call with ID:', this.softwareAssetType.asset_type_id);
      this.equipmentService.getSoftwares(this.softwareAssetType.asset_type_id).subscribe({
        next: (data) => console.log('✅ Software API Response:', data),
        error: (error) => console.error('❌ Software API Error:', error)
      });
    }
  }

  // ...existing code...
}
