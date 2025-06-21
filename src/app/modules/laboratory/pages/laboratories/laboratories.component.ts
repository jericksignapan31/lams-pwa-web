import { Component } from '@angular/core';
import { LaboratoryService } from '../../services/laboratory.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ImportsModule } from '../../../../imports';
import { AddLaboratoryComponent } from '../../components/add-laboratory/add-laboratory.component';
import { EditLaboratoryComponent } from '../../components/edit-laboratory/edit-laboratory.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-laboratories',
  imports: [
    CommonModule,
    FormsModule,
    ImportsModule,
    AddLaboratoryComponent,
    EditLaboratoryComponent,
  ],
  templateUrl: './laboratories.component.html',
  styleUrl: './laboratories.component.scss',
})
export class LaboratoriesComponent {
  laboratories: any[] = [];
  searchTerm: string = '';
  showAddModal = false;
  showEditModal = false;
  selectedLaboratory: any = null;

  constructor(private laboratoryService: LaboratoryService) {
    this.laboratoryService.getLaboratories().subscribe((data) => {
      // console.log('Laboratories:', data);
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
    this.selectedLaboratory = lab;
    this.showEditModal = true;
  }

  onEditModalClose() {
    this.showEditModal = false;
    this.selectedLaboratory = null;
  }

  onLaboratoryUpdated(updatedLab: any) {
    const idx = this.laboratories.findIndex(
      (l) => l.laboratory_id === updatedLab.laboratory_id
    );
    if (idx > -1) {
      this.laboratories[idx] = updatedLab;
    }
    this.showEditModal = false;
    this.selectedLaboratory = null;
  }

  onDelete(lab: any) {
    if (!lab?.laboratory_id) return;
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the laboratory.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.laboratoryService.deleteLaboratory(lab.laboratory_id).subscribe({
          next: () => {
            this.laboratories = this.laboratories.filter(
              (l) => l.laboratory_id !== lab.laboratory_id
            );
            Swal.fire('Deleted!', 'The laboratory has been deleted.', 'success');
          },
          error: () => {
            Swal.fire('Error', 'Failed to delete laboratory.', 'error');
          },
        });
      }
    });
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
