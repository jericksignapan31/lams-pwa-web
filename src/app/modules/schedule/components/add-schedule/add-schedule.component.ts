import { ImportsModule } from './../../../../imports';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'add-schedule',
  imports: [CommonModule, FormsModule, ImportsModule],
  templateUrl: './add-schedule.component.html',
  styleUrl: './add-schedule.component.scss',
})
export class AddScheduleComponent {
  showForm = false;

  toggleForm() {
    this.showForm = !this.showForm;
  }
}
