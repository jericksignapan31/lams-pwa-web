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
import { To24HourPipe } from '../../pipes/to24-hour.pipe';

@Component({
  selector: 'app-schedules',
  imports: [CommonModule, FormsModule, ImportsModule, DropdownModule],
  providers: [To24HourPipe],
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
  schedules: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private laboratoryService: LaboratoryService,
    private scheduleService: ScheduleService,
    private alertService: AlertService,
    private to24Hour: To24HourPipe
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
            this.schedules = schedules;
          },
          error: (err) => {
            console.error('Failed to fetch class schedules:', err);
          },
        });
      }
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
    this.scheduleService
      .createClassSchedule(this.laboratoryId, data)
      .subscribe({
        next: (response) => {
          this.alertService.handleSuccess('Schedule created successfully!');
          window.location.reload();
        },
        error: (err) => {
          console.error('Failed to create schedule:', err);
          this.alertService.handleError('Failed to create schedule!');
        },
      });
  }

  getSchedulesForCell(day: string, time: string) {
    const gridDay = day.toLowerCase();
    const gridTime = this.to24Hour.transform(time).slice(0, 5); // 'HH:mm'
    return this.schedules.filter((s) => {
      const schedDay = (s.day_of_week || '').toLowerCase();
      const schedTime = (s.start_time || '').slice(0, 5); // 'HH:mm'
      return schedDay === gridDay && schedTime === gridTime;
    });
  }

  getSchedulesForDay(day: string) {
    const gridDay = day.toLowerCase();
    return this.schedules.filter(
      (s) => (s.day_of_week || '').toLowerCase() === gridDay
    );
  }

  getUnmatchedSchedules() {
    return this.schedules.filter(
      (s) =>
        !this.timeSlots.some((t) =>
          this.getSchedulesForCell(s.day_of_week, t).includes(s)
        )
    );
  }
}
