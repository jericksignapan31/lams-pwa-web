import { Component } from '@angular/core';
import { LaboratoryService } from '../../services/laboratory.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ImportsModule } from '../../../../imports';
import { AddLaboratoryComponent } from '../../components/add-laboratory/add-laboratory.component';

@Component({
  selector: 'app-laboratories',
  imports: [CommonModule, FormsModule, ImportsModule, AddLaboratoryComponent],
  templateUrl: './laboratories.component.html',
  styleUrl: './laboratories.component.scss',
})
export class LaboratoriesComponent {
  laboratories: any[] = [];
  searchTerm: string = '';
  showAddModal = false;

  constructor(private laboratoryService: LaboratoryService) {
    this.laboratoryService.getLaboratories().subscribe((data) => {
      console.log('Laboratories:', data);
      this.laboratories = data;
    });
  }

  onAddLaboratoryRoom() {
    this.showAddModal = true;
  }

  onAddModalClose() {
    this.showAddModal = false;
  }

  onLaboratoryCreated(lab: any) {
    this.laboratories.push(lab);
    this.showAddModal = false;
  }

  onEdit(lab: any) {
    alert('Edit: ' + lab.laboratory_name);
  }

  onDelete(lab: any) {
    alert('Delete: ' + lab.laboratory_name);
  }

  get filteredLaboratories() {
    if (!this.searchTerm || !this.laboratories) {
      return this.laboratories;
    }
    const term = this.searchTerm.toLowerCase();
    return this.laboratories.filter(
      (lab) =>
        (lab.laboratory_name &&
          lab.laboratory_name.toLowerCase().includes(term)) ||
        (lab.location && lab.location.toLowerCase().includes(term)) ||
        (lab.room_no && lab.room_no.toString().toLowerCase().includes(term))
    );
  }
}
