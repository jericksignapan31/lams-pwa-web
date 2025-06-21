import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddScheduleComponent } from '../../components/add-schedule/add-schedule.component';

@Component({
  selector: 'app-schedules',
  imports: [CommonModule, FormsModule],
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.scss',
  providers: [AddScheduleComponent],
})
export class SchedulesComponent implements OnInit {
  laboratoryName: string = '';
  roomName: string = '';
  showTopDiv = true;

  form = {
    class_name: '',
    faculty: null,
    day_of_week: null,
    start_time: null,
    end_time: null,
    course_code: '',
    course: '',
    year: null,
    section: '',
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.laboratoryName = params.get('laboratoryName') || '';
      this.roomName = params.get('roomName') || '';
      // You can fetch or display data for this laboratory/room here
    });
  }

  onSubmit() {
    // Handle form submission here
    console.log('Form submitted:', this.form);
    // Optionally reset the form
    // this.form = { class_name: '', faculty: null, day_of_week: null, start_time: null, end_time: null, course_code: '', course: '', year: null, section: '' };
  }
}
