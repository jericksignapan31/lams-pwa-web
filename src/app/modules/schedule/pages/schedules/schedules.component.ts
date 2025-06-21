import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-schedules',
  imports: [CommonModule],
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.scss',
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
