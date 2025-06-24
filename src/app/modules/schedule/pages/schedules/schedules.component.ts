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
            // Log start_time and end_time for each schedule
            this.schedules.forEach((schedule, index) => {
              console.log(`Schedule ${index + 1}:`, {
                class_name: schedule.class_name,
                day_of_week: schedule.day_of_week,
                start_time: schedule.start_time,
                end_time: schedule.end_time,
                year: schedule.year,
                grade_level: this.getGradeLevel(schedule.year),
              });
            });
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

    // Console log the start_time and end_time from form
    console.log('Form start_time:', this.form.start_time);
    console.log('Form end_time:', this.form.end_time);

    const dayValue =
      (this.form.day_of_week && (this.form.day_of_week as any).value) ||
      this.form.day_of_week;
    const data = {
      ...this.form,
      day_of_week: dayValue,
    };

    console.log('Data being sent:', data);

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
    const gridTime = this.to24Hour.transform(time).slice(0, 5);
    return this.schedules.filter((s) => {
      const schedDay = (s.day_of_week || '').toLowerCase();
      const schedTime = (s.start_time || '').slice(0, 5);
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

  /**
   * Calculate the height of a schedule card based on its duration
   * Each time slot is 40px, so we calculate how many slots the schedule spans
   */
  calculateScheduleHeight(schedule: any): string {
    if (!schedule.start_time || !schedule.end_time) {
      return '40px'; // Default height for one slot
    }

    const startTime = this.convertToMinutes(schedule.start_time);
    const endTime = this.convertToMinutes(schedule.end_time);
    const durationMinutes = endTime - startTime;

    // Each time slot is 30 minutes (40px height)
    const slotsSpanned = durationMinutes / 30;
    const heightPx = slotsSpanned * 40;

    console.log(
      `Schedule: ${schedule.class_name}, Start: ${schedule.start_time}, End: ${schedule.end_time}, Duration: ${durationMinutes}min, Height: ${heightPx}px`
    );

    return `${heightPx}px`;
  }

  /**
   * Convert time string (HH:MM or HH:MM AM/PM) to minutes since midnight
   */
  private convertToMinutes(timeStr: string): number {
    if (!timeStr) return 0;

    // Handle 24-hour format (HH:MM)
    if (
      timeStr.includes(':') &&
      !timeStr.includes('AM') &&
      !timeStr.includes('PM')
    ) {
      const [hours, minutes] = timeStr.split(':').map((num) => parseInt(num));
      return hours * 60 + minutes;
    }

    // Handle 12-hour format (HH:MM AM/PM)
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map((num) => parseInt(num));

    let totalMinutes = hours * 60 + minutes;

    if (period === 'PM' && hours !== 12) {
      totalMinutes += 12 * 60;
    } else if (period === 'AM' && hours === 12) {
      totalMinutes -= 12 * 60;
    }

    return totalMinutes;
  }

  /**
   * Get grade level display text based on year
   */
  getGradeLevel(year: number): string {
    if (!year) return 'N/A';

    switch (year) {
      case 1:
        return '1st Year';
      case 2:
        return '2nd Year';
      case 3:
        return '3rd Year';
      case 4:
        return '4th Year';
      case 5:
        return '5th Year';
      default:
        return `${year}th Year`;
    }
  }

  /**
   * Get color class based on year level for visual distinction
   */
  getYearColorClass(year: number): string {
    if (!year) return 'year-default';

    switch (year) {
      case 1:
        return 'year-1';
      case 2:
        return 'year-2';
      case 3:
        return 'year-3';
      case 4:
        return 'year-4';
      case 5:
        return 'year-5';
      default:
        return 'year-default';
    }
  }

  /**
   * Get priority level for layering overlapping schedules
   */
  getSchedulePriority(schedule: any): number {
    // Higher year levels get higher priority (appear on top)
    return schedule.year || 0;
  }
}
