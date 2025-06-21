import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AddScheduleComponent } from '../../components/add-schedule/add-schedule.component';

@Component({
  selector: 'app-schedules',
  imports: [CommonModule, AddScheduleComponent],
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.scss',
  providers: [AddScheduleComponent],
})
export class SchedulesComponent implements OnInit {
  laboratoryName: string = '';
  roomName: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.laboratoryName = params.get('laboratoryName') || '';
      this.roomName = params.get('roomName') || '';
      // You can fetch or display data for this laboratory/room here
    });
  }
}
