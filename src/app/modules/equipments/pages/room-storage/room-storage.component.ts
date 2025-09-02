import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../../../imports';
import { EquipmentService } from '../../services/equipment.service';

@Component({
  selector: 'app-room-storage',
  imports: [CommonModule, ImportsModule],
  templateUrl: './room-storage.component.html',
  styleUrl: './room-storage.component.scss',
})
export class RoomStorageComponent implements OnInit {
  assets: any[] = [];
  loading: boolean = false;
  showTableSection: boolean = true;

  constructor(private equipmentService: EquipmentService) {}

  ngOnInit(): void {
    this.loadAssets();
  }

  loadAssets() {
    this.loading = true;
    this.equipmentService.getAssets().subscribe({
      next: (data) => {
        this.assets = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onShowAsset(asset: any) {
    // Show asset details logic here
    console.log('Show asset:', asset);
  }

  onEditAsset(asset: any) {
    // Edit asset logic here
    console.log('Edit asset:', asset);
  }

  onArchiveAsset(asset: any) {
    // Archive asset logic here
    console.log('Archive asset:', asset);
  }
}
