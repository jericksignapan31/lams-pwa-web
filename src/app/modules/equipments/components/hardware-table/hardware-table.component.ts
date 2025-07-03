import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  EquipmentService,
  ASSET_TYPES,
} from '../../services/equipment.service';

interface HardwareEquipment {
  id?: string;
  hardware_name: string;
  brand_name: string;
  model: string;
  serial_number: string;
  date_acquired?: Date | string | null;
  unit_cost?: number | null;
  color?: string;
  height?: number | null;
  width?: number | null;
  length?: number | null;
  weight?: number | null;
  package_material?: string;
  package_color?: string;
  estimated_useful_life?: number | null;
  laboratory?: any;
  laboratory_name?: string;
  campus?: string;
}

@Component({
  selector: 'app-hardware-table',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    ProgressSpinnerModule,
    MessageModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './hardware-table.component.html',
  styleUrl: './hardware-table.component.scss',
})
export class HardwareTableComponent implements OnInit {
  @Input() autoLoad: boolean = true;
  @Input() assetTypeId: string = ASSET_TYPES.HARDWARE; // Accept asset type ID as input
  @Output() editHardware = new EventEmitter<HardwareEquipment>();
  @Output() viewHardware = new EventEmitter<HardwareEquipment>();
  @Output() deleteHardware = new EventEmitter<string>();

  hardwareList: HardwareEquipment[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(
    private equipmentService: EquipmentService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    if (this.autoLoad) {
      this.loadHardware();
    }
  }

  /**
   * Load hardware equipment from API
   */
  loadHardware() {
    this.loading = true;
    this.error = '';

    console.log('🔧 HardwareTableComponent - Loading hardware with asset type ID:', this.assetTypeId);

    this.equipmentService.getHardwares(this.assetTypeId).subscribe({
      next: (response) => {
        console.log('✅ Hardware equipment loaded in table component:', response);
        this.hardwareList = response || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error loading hardware in table component:', error);
        this.error = error.message || 'Failed to load hardware equipment';
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.error,
        });
      },
    });
  }

  /**
   * Refresh hardware data (can be called externally or when asset type changes)
   */
  refreshData() {
    console.log('🔄 HardwareTableComponent - Refreshing hardware data...');
    this.loadHardware();
  }

  /**
   * Update asset type ID and reload data
   */
  updateAssetTypeId(newAssetTypeId: string) {
    console.log('🔄 HardwareTableComponent - Updating asset type ID:', newAssetTypeId);
    this.assetTypeId = newAssetTypeId;
    this.loadHardware();
  }

  /**
   * Handle edit action
   */
  onEdit(hardware: HardwareEquipment) {
    console.log('Edit hardware:', hardware);
    this.editHardware.emit(hardware);
  }

  /**
   * Handle view action
   */
  onView(hardware: HardwareEquipment) {
    console.log('View hardware:', hardware);
    this.viewHardware.emit(hardware);
  }

  /**
   * Handle delete action with confirmation
   */
  onDelete(hardware: HardwareEquipment) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${hardware.hardware_name}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.performDelete(hardware);
      },
    });
  }

  /**
   * Perform the actual delete operation
   */
  private performDelete(hardware: HardwareEquipment) {
    if (!hardware.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Cannot delete hardware: Invalid ID',
      });
      return;
    }

    this.equipmentService
      .deleteHardware(ASSET_TYPES.HARDWARE, hardware.id)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Hardware "${hardware.hardware_name}" deleted successfully`,
          });
          this.loadHardware(); // Refresh the table
          this.deleteHardware.emit(hardware.id);
        },
        error: (error) => {
          console.error('❌ Error deleting hardware:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              error.error?.message || 'Failed to delete hardware equipment',
          });
        },
      });
  }

  /**
   * Refresh the hardware table
   */
  refresh() {
    this.loadHardware();
  }

  /**
   * Format currency for display
   */
  formatCurrency(value: number | null): string {
    if (value === null || value === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP',
    }).format(value);
  }

  /**
   * Format date for display
   */
  formatDate(date: Date | string | null): string {
    if (!date) return '-';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  }

  /**
   * Format dimensions for display
   */
  formatDimensions(hardware: HardwareEquipment): string {
    const { height, width, length } = hardware;
    if (!height && !width && !length) return '-';

    const parts = [];
    if (height) parts.push(`H: ${height}`);
    if (width) parts.push(`W: ${width}`);
    if (length) parts.push(`L: ${length}`);

    return parts.join(', ');
  }
}
