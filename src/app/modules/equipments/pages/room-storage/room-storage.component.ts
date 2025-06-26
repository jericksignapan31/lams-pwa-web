import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EquipmentService } from '../../services/equipment.service';
import { LaboratoryService } from '../../../laboratory/services/laboratory.service';
import { Equipment } from '../../model/product';
import { ImportsModule } from '../../../../imports';

@Component({
  selector: 'app-room-storage',
  imports: [CommonModule, ImportsModule],
  templateUrl: './room-storage.component.html',
  styleUrl: './room-storage.component.scss',
})
export class RoomStorageComponent implements OnInit {
  equipment: Equipment[] = [];
  filteredEquipment: Equipment[] = [];
  currentLaboratory: string = '';
  currentLaboratoryId: string = '';
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private equipmentService: EquipmentService,
    private laboratoryService: LaboratoryService
  ) {}

  ngOnInit() {
    // Get laboratory parameters from route
    this.route.queryParams.subscribe((params) => {
      this.currentLaboratory = params['laboratory'] || '';
      this.currentLaboratoryId = params['labId'] || '';

      console.log('🏠 Room Storage - Laboratory:', this.currentLaboratory);
      console.log('🏠 Room Storage - Laboratory ID:', this.currentLaboratoryId);

      if (this.currentLaboratory) {
        this.loadEquipmentForLaboratory();
      } else {
        // If no laboratory specified, load all equipment
        this.loadAllEquipment();
      }
    });
  }

  private loadEquipmentForLaboratory() {
    this.isLoading = true;
    this.error = null;

    this.equipmentService.getEquipments().subscribe({
      next: (data: Equipment[]) => {
        console.log('📦 All equipment loaded:', data);
        this.equipment = data;

        // Filter equipment by laboratory name
        this.filteredEquipment = data.filter(
          (eq) =>
            eq.laboratory === this.currentLaboratory ||
            eq.laboratory?.toLowerCase() ===
              this.currentLaboratory.toLowerCase()
        );

        console.log(
          `🔍 Filtered equipment for ${this.currentLaboratory}:`,
          this.filteredEquipment
        );
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Failed to load equipment:', err);
        this.error = 'Failed to load equipment data';
        this.isLoading = false;
      },
    });
  }

  private loadAllEquipment() {
    this.isLoading = true;
    this.error = null;
    this.currentLaboratory = 'All Laboratories';

    this.equipmentService.getEquipments().subscribe({
      next: (data: Equipment[]) => {
        console.log('📦 All equipment loaded:', data);
        this.equipment = data;
        this.filteredEquipment = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Failed to load equipment:', err);
        this.error = 'Failed to load equipment data';
        this.isLoading = false;
      },
    });
  }

  getStatusSeverity(status: string): string {
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
        return 'success';
    }
  }
}
