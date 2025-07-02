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
import { EquipmentService } from '../../services/equipment.service';
import { LaboratoryService } from '../../../laboratory/services/laboratory.service';
import { AlertService } from '../../../../core/services/alert.service';
import { AddEquipmentComponent } from '../../components/add-equipment/add-equipment.component';

@Component({
  selector: 'app-equipment',
  imports: [ImportsModule, AddEquipmentComponent],
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

  constructor(
    private alertService: AlertService,
    private equipmentService: EquipmentService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.testGetAssets();
  }

  /**
   * Test method to call getAssets from EquipmentService
   */
  testGetAssets() {
    console.log('🧪 Testing getAssets method...');
    this.loading = true;
    this.error = '';

    this.equipmentService.getAssets().subscribe({
      next: (response) => {
        console.log('✅ getAssets success:', response);
        this.assets = response || [];
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Successfully loaded ${this.assets.length} assets`,
        });
      },
      error: (error) => {
        console.error('❌ getAssets error:', error);
        this.error = error.message || 'Failed to load assets';
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load assets: ' + this.error,
        });
      },
    });
  }

  /**
   * Manual trigger for testing (called from template)
   */
  retryLoadAssets() {
    this.testGetAssets();
  }

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
    this.testGetAssets(); // Refresh the assets list
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Equipment added successfully!',
    });
  }
}
