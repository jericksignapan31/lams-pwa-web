import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../services/department.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ImportsModule } from '../../../../imports';
import { AddDepartmentComponent } from '../../components/add-department/add-department.component';
import { DialogModule } from 'primeng/dialog';
import { EditDepartmentComponent } from '../../components/edit-department/edit-department.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ImportsModule,
    AddDepartmentComponent,
    DialogModule,
    EditDepartmentComponent,
  ],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss',
})
export class DepartmentsComponent implements OnInit {
  departments: any[] = [];
  searchTerm: string = '';
  showAddModal = false;
  showEditModal = false;
  selectedDepartment: any = null;

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    console.log('🔍 DepartmentsComponent - Loading departments...');
    this.departmentService.getDepartments().subscribe({
      next: (data) => {
        console.log('✅ Departments loaded successfully:', data);
        
        // Handle different response formats
        if (Array.isArray(data)) {
          this.departments = data;
        } else if (data && Array.isArray(data.data)) {
          this.departments = data.data;
        } else if (data && Array.isArray(data.results)) {
          this.departments = data.results;
        } else {
          console.warn('⚠️ Unexpected departments response format:', data);
          this.departments = [];
        }
        
        console.log('🔍 Final departments array:', this.departments);
        console.log('🔍 Departments count:', this.departments.length);
      },
      error: (err) => {
        console.error('❌ Failed to fetch departments:', err);
        console.error('❌ Error status:', err.status);
        console.error('❌ Error details:', err.error);
        
        let errorMessage = 'Failed to load departments.';
        if (err.status === 403) {
          errorMessage = 'Access denied to departments. Check user permissions.';
        } else if (err.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (err.status === 500) {
          errorMessage = 'Server error when loading departments.';
        } else if (err.status === 0) {
          errorMessage = 'Cannot connect to server. Check if backend is running.';
        }
        
        Swal.fire({
          icon: 'error',
          title: 'Error Loading Departments',
          text: errorMessage,
          confirmButtonColor: '#f5a623',
        });
      },
    });
  }

  onAddDepartment() {
    this.showAddModal = true;
  }

  onAddModalClose() {
    this.showAddModal = false;
  }

  onDepartmentCreated(dept: any) {
    this.departments.push(dept);
    this.showAddModal = false;
  }

  onEdit(dept: any) {
    this.selectedDepartment = dept;
    this.showEditModal = true;
  }

  onEditModalClose() {
    this.showEditModal = false;
    this.selectedDepartment = null;
  }

  onDepartmentUpdated(updatedDept: any) {
    const idx = this.departments.findIndex(
      (d) => d.department_id === updatedDept.department_id
    );
    if (idx > -1) {
      this.departments[idx] = updatedDept;
    }
    this.showEditModal = false;
    this.selectedDepartment = null;
  }

  onDelete(dept: any) {
    if (!dept?.department_id) return;
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the department.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.departmentService.deleteDepartment(dept.department_id).subscribe({
          next: () => {
            this.departments = this.departments.filter(
              (d) => d.department_id !== dept.department_id
            );
            Swal.fire(
              'Deleted!',
              'The department has been deleted.',
              'success'
            );
          },
          error: () => {
            Swal.fire('Error', 'Failed to delete department.', 'error');
          },
        });
      }
    });
  }

  get filteredDepartments() {
    if (!this.searchTerm || !this.departments) {
      return this.departments;
    }
    const term = this.searchTerm.toLowerCase();
    return this.departments.filter(
      (dept) =>
        (dept.department_name &&
          dept.department_name.toLowerCase().includes(term)) ||
        (dept.department_head &&
          dept.department_head.toLowerCase().includes(term)) ||
        (dept.campus && dept.campus.toLowerCase().includes(term))
    );
  }
}
