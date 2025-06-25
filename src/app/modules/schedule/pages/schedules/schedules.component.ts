import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddScheduleComponent } from '../../components/add-schedule/add-schedule.component';
import { timeSlots, days, Schedule, ScheduleForm } from '../../model/schedule';
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
  form: ScheduleForm = {
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
  schedules: Schedule[] = [];

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

            // Enhanced logging to check year field availability
            console.log('Total schedules received:', this.schedules.length);

            // Log start_time and end_time for each schedule
            this.schedules.forEach((schedule, index) => {
              console.log(`Schedule ${index + 1}:`, {
                id: schedule.id,
                class_name: schedule.class_name,
                day_of_week: schedule.day_of_week,
                start_time: schedule.start_time,
                end_time: schedule.end_time,
                year: schedule.year,
                grade_level: this.getGradeLevel(schedule.year),
                faculty: schedule.faculty || schedule.faculty_name,
                course_code: schedule.course_code,
                course: schedule.course,
                section: schedule.section,
                // Log all available fields to see what's coming from API
                all_fields: Object.keys(schedule),
              });
            });

            // Summary of year levels found
            const yearLevels = this.schedules
              .map((s) => s.year)
              .filter((year) => year !== null && year !== undefined);
            console.log('Year levels found:', [...new Set(yearLevels)]);
            console.log(
              'Schedules without year:',
              this.schedules.filter((s) => !s.year).length
            );
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
    console.log('Form year:', this.form.year);

    const dayValue =
      (this.form.day_of_week && (this.form.day_of_week as any).value) ||
      this.form.day_of_week;
    const data = {
      ...this.form,
      day_of_week: dayValue,
    };

    console.log('Data being sent to API:', data);
    console.log('Year field in data:', data.year);

    this.scheduleService
      .createClassSchedule(this.laboratoryId, data)
      .subscribe({
        next: (response) => {
          console.log('Schedule creation response:', response);
          this.alertService.handleSuccess('Schedule created successfully!');
          window.location.reload();
        },
        error: (err) => {
          console.error('Failed to create schedule:', err);
          console.error('Error details:', err.error);
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
  calculateScheduleHeight(schedule: Schedule): string {
    if (!schedule.start_time || !schedule.end_time) {
      return '40px'; // Default height for one slot
    }

    const startTime = this.convertToMinutes(schedule.start_time);
    const endTime = this.convertToMinutes(schedule.end_time);
    const durationMinutes = endTime - startTime;

    // Each time slot is 30 minutes (40px height)
    const slotsSpanned = durationMinutes / 30;
    const heightPx = slotsSpanned * 40;

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
  getGradeLevel(year?: number): string {
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
  getYearColorClass(year?: number): string {
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
  getSchedulePriority(schedule: Schedule): number {
    // Higher year levels get higher priority (appear on top)
    return schedule.year || 0;
  }

  /**
   * Generate a random background color for schedule cards
   */
  getRandomBackgroundColor(): string {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
      'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      'linear-gradient(135deg, #ff8a80 0%, #ea4c89 100%)',
      'linear-gradient(135deg, #8fd3f4 0%, #84fab0 100%)',
      'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
      'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      'linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)',
      'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
      'linear-gradient(135deg, #b2fefa 0%, #0ed2f7 100%)',
      'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)',
      'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
      'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  }
  /**
   * Get consistent random color based on schedule ID or class name
   */ getConsistentRandomColor(schedule: Schedule): string {
    const identifier = String(schedule.id || schedule.class_name || 'default');
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
      'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      'linear-gradient(135deg, #ff8a80 0%, #ea4c89 100%)',
      'linear-gradient(135deg, #8fd3f4 0%, #84fab0 100%)',
      'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
      'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      'linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)',
      'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
      'linear-gradient(135deg, #b2fefa 0%, #0ed2f7 100%)',
      'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)',
      'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
      'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
    ];

    // Create a simple hash from the identifier
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      const char = identifier.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Use absolute value to ensure positive index
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }
}
