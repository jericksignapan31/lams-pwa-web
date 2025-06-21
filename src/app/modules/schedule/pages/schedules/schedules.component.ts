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
  laboratoryId: string = '';
  laboratoryName: string = '';
  roomName: string = '';
  showTopDiv = false;
  days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
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

  timeSlots = [
    '07:00 AM',
    '07:30 AM',
    '08:00 AM',
    '08:30 AM',
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '12:30 PM',
    '01:00 PM',
    '01:30 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
    '05:00 PM',
    '05:30 PM',
    '06:00 PM',
    '06:30 PM',
    '07:00 PM',
    '07:30 PM',
    '08:00 PM',
    '08:30 PM',
    '09:00 PM',
    '09:30 PM',
    '10:00 PM',
    '10:30 PM',
    '11:00 PM',
    '11:30 PM',
    '12:00 AM',
  ];

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.laboratoryId = params.get('laboratoryId') || '';
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
