import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddScheduleComponent } from '../../components/add-schedule/add-schedule.component';
import { timeSlots, days } from '../../model/schedule';
import { LaboratoryService } from '../../../laboratory/services/laboratory.service';
import { ScheduleService } from '../../services/schedule.service';
import { ImportsModule } from '../../../../imports';
import { Select } from 'primeng/select';
import { DropdownModule } from 'primeng/dropdown';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-schedules',
  imports: [CommonModule, FormsModule, ImportsModule, DropdownModule],
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.scss',
})
export class SchedulesComponent implements OnInit {
  laboratoryId: string = '';
  laboratoryName: string = '';
  roomName: string = '';
  showTopDiv = false;
  days = days;
  daysOptions = days.map((day) => ({ name: day, value: day }));
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

  constructor(
    private route: ActivatedRoute,
    private laboratoryService: LaboratoryService,
    private scheduleService: ScheduleService,
    private alertService: AlertService
  ) {}

  timeSlots = timeSlots;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.laboratoryId = params.get('laboratoryId') || '';
      this.roomName = params.get('roomName') || '';
      if (this.laboratoryId) {
        this.laboratoryService.getLaboratory(this.laboratoryId).subscribe({
          next: (lab) => {
            console.log('API response for laboratory:', lab);
            this.laboratoryName = lab?.laboratory_name || '';
            console.log('laboratoryName:', this.laboratoryName);
          },
          error: (err) => {
            console.error('Failed to fetch laboratory:', err);
            this.laboratoryName = '';
          },
        });
        this.scheduleService.getClassSchedules(this.laboratoryId).subscribe({
          next: (schedules) => {
            console.log(
              'Class schedules for labId',
              this.laboratoryId,
              ':',
              schedules
            );
          },
          error: (err) => {
            console.error('Failed to fetch class schedules:', err);
          },
        });
      }
      console.log('laboratoryId:', this.laboratoryId);
      console.log('roomName:', this.roomName);
    });
  }

  onSubmit() {
    if (!this.laboratoryId) {
      this.alertService.handleError('No laboratoryId found!');
      return;
    }
    const dayValue =
      (this.form.day_of_week && (this.form.day_of_week as any).value) ||
      this.form.day_of_week;
    const data = {
      ...this.form,
      day_of_week: dayValue,
    };
    console.log('Submitting schedule:', data);
    this.scheduleService
      .createClassSchedule(this.laboratoryId, data)
      .subscribe({
        next: (response) => {
          console.log('Schedule created successfully:', response);
          this.alertService.handleSuccess('Schedule created successfully!');
        },
        error: (err) => {
          console.error('Failed to create schedule:', err);
          this.alertService.handleError('Failed to create schedule!');
        },
      });
  }
}
