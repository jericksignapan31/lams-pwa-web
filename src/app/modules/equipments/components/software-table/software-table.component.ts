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

interface SoftwareEquipment {
  id?: string;
  software_name: string;
  version: string;
  license_key?: string;
  license_count?: number | null;
  vendor: string;
  license_expiry_date?: Date | string | null;
  assigned_to?: string;
  date_acquired?: Date | string | null;
  unit_cost?: number | null;
  laboratory?: any;
  laboratory_name?: string;
  campus?: string;
}

@Component({
  selector: 'app-software-table',
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
  templateUrl: './software-table.component.html',
  styleUrl: './software-table.component.scss',
})
export class SoftwareTableComponent implements OnInit {
  @Input() autoLoad: boolean = true;
  @Input() assetTypeId: string = ASSET_TYPES.SOFTWARE; // Accept asset type ID as input
  @Output() editSoftware = new EventEmitter<SoftwareEquipment>();
  @Output() viewSoftware = new EventEmitter<SoftwareEquipment>();
  @Output() deleteSoftware = new EventEmitter<string>();

  softwareList: SoftwareEquipment[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(
    private equipmentService: EquipmentService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    if (this.autoLoad) {
      this.loadSoftware();
    }
  }

  /**
   * Load software equipment from API
   */
  loadSoftware() {
    this.loading = true;
    this.error = '';

    console.log('💻 SoftwareTableComponent - Loading software with asset type ID:', this.assetTypeId);

    this.equipmentService.getSoftwares(this.assetTypeId).subscribe({
      next: (response) => {
        console.log('✅ Software equipment loaded in table component:', response);
        this.softwareList = response || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error loading software:', error);
        this.error = error.message || 'Failed to load software equipment';
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
   * Handle edit action
   */
  onEdit(software: SoftwareEquipment) {
    console.log('Edit software:', software);
    this.editSoftware.emit(software);
  }

  /**
   * Handle view action
   */
  onView(software: SoftwareEquipment) {
    console.log('View software:', software);
    this.viewSoftware.emit(software);
  }

  /**
   * Handle delete action with confirmation
   */
  onDelete(software: SoftwareEquipment) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${software.software_name}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.performDelete(software);
      },
    });
  }

  /**
   * Perform the actual delete operation
   */
  private performDelete(software: SoftwareEquipment) {
    if (!software.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Cannot delete software: Invalid ID',
      });
      return;
    }

    this.equipmentService
      .deleteSoftware(ASSET_TYPES.SOFTWARE, software.id)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Software "${software.software_name}" deleted successfully`,
          });
          this.loadSoftware(); // Refresh the table
          this.deleteSoftware.emit(software.id);
        },
        error: (error) => {
          console.error('❌ Error deleting software:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              error.error?.message || 'Failed to delete software equipment',
          });
        },
      });
  }

  /**
   * Refresh the software table
   */
  refresh() {
    this.loadSoftware();
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
   * Check if license is expired
   */
  isLicenseExpired(expiryDate: Date | string | null): boolean {
    if (!expiryDate) return false;
    const expiry =
      typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
    return expiry < new Date();
  }

  /**
   * Get count of expired licenses
   */
  getExpiredLicensesCount(): number {
    return this.softwareList.filter(
      (software) =>
        software.license_expiry_date &&
        this.isLicenseExpired(software.license_expiry_date)
    ).length;
  }
}
