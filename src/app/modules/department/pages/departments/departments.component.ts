import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../services/department.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ImportsModule } from '../../../../imports';
import { AddDepartmentComponent } from '../../components/add-department/add-department.component';
import { DialogModule } from 'primeng/dialog';

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
  ],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss',
})
export class DepartmentsComponent implements OnInit {
  departments: any[] = [];
  searchTerm: string = '';
  showAddModal = false;

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.departmentService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        console.log('Departments:', data);
      },
      error: (err) => {
        console.error('Failed to fetch departments:', err);
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
    alert('Edit Department: ' + dept.department_name);
  }

  onDelete(dept: any) {
    alert('Delete Department: ' + dept.department_name);
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
