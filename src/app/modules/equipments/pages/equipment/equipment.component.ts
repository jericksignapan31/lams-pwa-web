import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product, Equipment } from '../../model/product';
import { Table } from 'primeng/table';
import { EquipmentService } from '../../services/equipment.service';
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
  isLoading: boolean = false;
  loadingError: string | null = null;

  products: Product[] = [];
  equipment: Equipment[] = [];

  product!: Product;

  selectedProducts!: Product[] | null;

  submitted: boolean = false;

  statuses: any[] = [];

  @ViewChild('dt') dt!: Table;

  cols!: Column[];

  exportColumns!: ExportColumn[];

  constructor(
    private equipmentService: EquipmentService,
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
}
