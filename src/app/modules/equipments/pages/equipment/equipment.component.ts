import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  Product,
  Equipment,
  EquipmentForm,
  Laboratory,
} from '../../model/product';
import { Table } from 'primeng/table';
import { EquipmentService } from '../../services/equipment.service';
import { LaboratoryService } from '../../../laboratory/services/laboratory.service';
import { AlertService } from '../../../../core/services/alert.service';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-equipment',
  imports: [ImportsModule],
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
export class EquipmentComponent {
  productDialog: boolean = false;
  equipmentDialog: boolean = false;
  isLoading: boolean = false;
  loadingError: string | null = null;
  isLoadingLaboratories: boolean = false;

  products: Product[] = [];
  equipment: Equipment[] = [];
  laboratories: Laboratory[] = [];

  product!: Product;

  // Equipment form data
  equipmentForm: EquipmentForm = {
    equipment_name: '',
    brand_name: '',
    model_number: '',
    serial_number: '',
    date_acquired: null,
    unit_cost: null,
    laboratory_id: null,
  };

  selectedProducts!: Product[] | null;

  submitted: boolean = false;

  statuses: any[] = [];

  @ViewChild('dt') dt!: Table;

  cols!: Column[];

  exportColumns!: ExportColumn[];

  constructor(
    private equipmentService: EquipmentService,
    private laboratoryService: LaboratoryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef,
    private alertService: AlertService
  ) {}

  exportCSV() {
    this.dt.exportCSV();
  }

  ngOnInit() {
    this.loadEquipmentData();
    this.loadLaboratories();
  }

  loadEquipmentData() {
    console.log('🔍 EquipmentComponent - Loading equipment data via API...');
    this.isLoading = true;
    this.loadingError = null;

    // Load real equipment data from API
    this.equipmentService.getEquipments().subscribe({
      next: (data: any[]) => {
        console.log('✅ Equipment loaded successfully:', data);
        this.equipment = data;

        // Convert API equipment data to Product format for display
        this.products = data.map((eq, index) => ({
          id: eq.equipment_id || `eq-${index}`,
          code: eq.serial_number || eq.model_number || `EQ-${index + 1}`,
          name: eq.equipment_name || 'Unknown Equipment',
          description: `${eq.brand_name || 'Unknown Brand'} - Model: ${
            eq.model_number || 'N/A'
          }`,
          price: parseFloat(eq.unit_cost) || 0,
          quantity: 1, // Default quantity since not provided in API
          inventoryStatus: 'INSTOCK', // Default status since not provided in API
          category: eq.laboratory || 'General',
          image: 'product-placeholder.svg',
          rating: 5, // Default rating
          // Additional equipment-specific fields for display
          brand: eq.brand_name,
          model: eq.model_number,
          serialNumber: eq.serial_number,
          dateAcquired: eq.date_acquired,
          laboratory: eq.laboratory,
          assignedUser: eq.user,
        }));

        console.log('🔄 Converted to display format:', this.products);

        // Initialize statuses and columns
        this.initializeStatuses();
        this.initializeColumns();

        this.isLoading = false;
        this.cd.markForCheck();
      },
      error: (err) => {
        console.error('❌ Failed to load equipment:', err);
        this.isLoading = false;
        this.loadingError = 'Failed to load equipment data';

        let errorMessage = 'Failed to load equipment.';
        if (err.status === 403) {
          errorMessage = 'Access denied to equipment. Check user permissions.';
        } else if (err.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (err.status === 500) {
          errorMessage = 'Server error when loading equipment.';
        } else if (err.status === 0) {
          errorMessage =
            'Cannot connect to server. Check if backend is running.';
        }

        this.alertService.handleError(errorMessage);

        // Fallback to demo data if API fails
        console.log('🔄 Falling back to demo data...');
        this.loadDemoData();
      },
    });
  }

  /**
   * Load laboratories for the selector - filtered by user's campus
   */
  loadLaboratories() {
    console.log(
      '🔍 EquipmentComponent - Loading laboratories for selector (filtered by campus)...'
    );
    this.isLoadingLaboratories = true;

    // Use campus-filtered method instead of getting all laboratories
    this.laboratoryService.getLaboratoriesByCampus().subscribe({
      next: (data: Laboratory[]) => {
        console.log(
          '✅ Laboratories loaded successfully (campus filtered):',
          data
        );
        this.laboratories = data;
        this.isLoadingLaboratories = false;
        this.cd.markForCheck();
      },
      error: (err) => {
        console.error('❌ Failed to load laboratories:', err);
        this.isLoadingLaboratories = false;
        this.alertService.handleError(
          'Failed to load laboratories for selection.'
        );

        // Fallback: try to load all laboratories if campus filtering fails
        console.log('🔄 Fallback: Loading all laboratories...');
        this.laboratoryService.getLaboratories().subscribe({
          next: (data: Laboratory[]) => {
            console.log('✅ Fallback: All laboratories loaded:', data);
            this.laboratories = data;
            this.cd.markForCheck();
          },
          error: (fallbackErr) => {
            console.error('❌ Fallback also failed:', fallbackErr);
          },
        });
      },
    });
  }

  /**
   * Open new equipment dialog
   */
  openNewEquipment() {
    this.equipmentForm = {
      equipment_name: '',
      brand_name: '',
      model_number: '',
      serial_number: '',
      date_acquired: null,
      unit_cost: null,
      laboratory_id: null,
    };
    this.submitted = false;
    this.equipmentDialog = true;
  }

  /**
   * Hide equipment dialog
   */
  hideEquipmentDialog() {
    this.equipmentDialog = false;
    this.submitted = false;
  }

  /**
   * Save equipment form
   */
  saveEquipment() {
    this.submitted = true;

    // Validate required fields
    const isValid =
      this.equipmentForm.equipment_name.trim() &&
      this.equipmentForm.brand_name.trim() &&
      this.equipmentForm.laboratory_id;

    if (isValid) {
      console.log('🔍 Creating equipment with data:', this.equipmentForm);

      this.equipmentService.createEquipment(this.equipmentForm).subscribe({
        next: (response) => {
          console.log('✅ Equipment created successfully:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Equipment created successfully!',
            life: 3000,
          });
          this.equipmentDialog = false;
          this.submitted = false;
          // Reload equipment data
          this.loadEquipmentData();
        },
        error: (err) => {
          console.error('❌ Failed to create equipment:', err);
          let errorMessage = 'Failed to create equipment. Please try again.';

          if (err.status === 400) {
            errorMessage = 'Invalid data provided. Please check all fields.';
          } else if (err.status === 403) {
            errorMessage =
              'Access denied. You may not have permission to create equipment.';
          } else if (err.status === 401) {
            errorMessage = 'Authentication failed. Please log in again.';
          }

          this.alertService.handleError(errorMessage);
        },
      });
    } else {
      this.alertService.handleError(
        'Please fill in all required fields: Equipment Name, Brand Name, and Laboratory.'
      );
    }
  }

  initializeStatuses() {
    this.statuses = [
      { label: 'AVAILABLE', value: 'AVAILABLE' },
      { label: 'IN USE', value: 'IN_USE' },
      { label: 'MAINTENANCE', value: 'MAINTENANCE' },
      { label: 'OUT OF ORDER', value: 'OUT_OF_ORDER' },
      // Legacy statuses for backward compatibility
      { label: 'INSTOCK', value: 'instock' },
      { label: 'LOWSTOCK', value: 'lowstock' },
      { label: 'OUTOFSTOCK', value: 'outofstock' },
    ];
  }

  initializeColumns() {
    this.cols = [
      {
        field: 'code',
        header: 'Serial/Model',
        customExportHeader: 'Serial Number',
      },
      { field: 'name', header: 'Equipment Name' },
      { field: 'brand', header: 'Brand' },
      { field: 'model', header: 'Model' },
      { field: 'price', header: 'Unit Cost' },
      { field: 'category', header: 'Laboratory' },
      { field: 'assignedUser', header: 'Assigned User' },
      { field: 'dateAcquired', header: 'Date Acquired' },
      { field: 'inventoryStatus', header: 'Status' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  loadDemoData() {
    this.equipmentService.getProducts().then((data: any) => {
      this.products = data;
      this.cd.markForCheck();
    });

    this.initializeStatuses();
    this.initializeColumns();
  }

  openNew() {
    this.product = {};
    this.submitted = false;
    this.productDialog = true;
  }

  editProduct(product: Product) {
    this.product = { ...product };
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products = this.products.filter(
          (val) => !this.selectedProducts?.includes(val)
        );
        this.selectedProducts = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Products Deleted',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products = this.products.filter((val) => val.id !== product.id);
        this.product = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Deleted',
          life: 3000,
        });
      },
    });
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  getSeverity(status: string) {
    switch (status?.toUpperCase()) {
      case 'AVAILABLE':
      case 'INSTOCK':
        return 'success';
      case 'IN_USE':
      case 'LOWSTOCK':
        return 'warn';
      case 'OUT_OF_ORDER':
      case 'OUTOFSTOCK':
        return 'danger';
      case 'MAINTENANCE':
        return 'info';
      default:
        return '';
    }
  }

  /**
   * Test method to manually call the equipment API
   */
  testEquipmentAPI() {
    console.log('🧪 Testing Equipment API manually...');
    this.isLoading = true;

    this.equipmentService.getEquipments().subscribe({
      next: (response) => {
        console.log('🧪 Manual API test - SUCCESS:', response);
        this.alertService.handleSuccess(
          `API test successful! Found ${response.length} equipment items. Check console for details.`
        );
        this.isLoading = false;
      },
      error: (err) => {
        console.error('🧪 Manual API test - ERROR:', err);
        this.alertService.handleError(
          `API test failed: ${err.message || 'Unknown error'}`
        );
        this.isLoading = false;
      },
    });
  }

  /**
   * Refresh equipment data
   */
  refreshEquipment() {
    this.loadEquipmentData();
  }

  saveProduct() {
    this.submitted = true;

    if (this.product.name?.trim()) {
      if (this.product.id) {
        this.products[this.findIndexById(this.product.id)] = this.product;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Updated',
          life: 3000,
        });
      } else {
        this.product.id = this.createId();
        this.product.image = 'product-placeholder.svg';
        this.products.push(this.product);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Created',
          life: 3000,
        });
      }

      this.products = [...this.products];
      this.productDialog = false;
      this.product = {};
    }
  }

  /**
   * Test method to manually call the laboratories API
   */
  testLaboratoriesAPI() {
    console.log('🧪 Testing Laboratories API manually...');
    this.isLoadingLaboratories = true;

    this.laboratoryService.getLaboratories().subscribe({
      next: (response) => {
        console.log(
          '🧪 Manual Laboratory API test - SUCCESS (all labs):',
          response
        );

        // Also test campus filtering
        this.laboratoryService.getLaboratoriesByCampus().subscribe({
          next: (filteredResponse) => {
            console.log(
              '🧪 Manual Laboratory API test - SUCCESS (campus filtered):',
              filteredResponse
            );
            this.alertService.handleSuccess(
              `Laboratory API test successful! Found ${response.length} total labs, ${filteredResponse.length} for your campus. Check console for details.`
            );
            this.isLoadingLaboratories = false;
          },
          error: (filterErr) => {
            console.error('🧪 Campus filtering failed:', filterErr);
            this.alertService.handleError(
              'Campus filtering failed, but basic API works.'
            );
            this.isLoadingLaboratories = false;
          },
        });
      },
      error: (err) => {
        console.error('🧪 Manual Laboratory API test - ERROR:', err);
        this.alertService.handleError(
          `Laboratory API test failed: ${err.message || 'Unknown error'}`
        );
        this.isLoadingLaboratories = false;
      },
    });
  }

  /**
   * Debug method to show current form state
   */
  debugFormState() {
    console.log('🔍 Current Equipment Form State:', this.equipmentForm);
    console.log('🔍 Available Laboratories:', this.laboratories);
    console.log('🔍 Form Submitted State:', this.submitted);
    console.log('🔍 Dialog Visible:', this.equipmentDialog);

    this.alertService.handleSuccess(
      'Form state logged to console. Check developer tools.'
    );
  }

  /**
   * Reset equipment form to default state
   */
  resetEquipmentForm() {
    this.equipmentForm = {
      equipment_name: '',
      brand_name: '',
      model_number: '',
      serial_number: '',
      date_acquired: null,
      unit_cost: null,
      laboratory_id: null,
    };
    this.submitted = false;
    console.log('🔄 Equipment form reset to default state');
  }
}
