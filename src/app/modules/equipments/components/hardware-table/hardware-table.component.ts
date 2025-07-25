import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, MessageService } from 'primeng/api';

interface HardwareEquipment {
  id?: string;
  hardware_name: string;
  brand_name: string;
  model: string;
  serial_number: string;
  date_acquired?: Date | string | null;
  unit_cost?: number | null;
  color?: string;
  height?: number | null;
  width?: number | null;
  length?: number | null;
  weight?: number | null;
  package_material?: string;
  package_color?: string;
  estimated_useful_life?: number | null;
  laboratory?: any;
  laboratory_name?: string;
  campus?: string;
}

@Component({
  selector: 'app-hardware-table',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    ProgressSpinnerModule,
    MessageModule,
    InputTextModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './hardware-table.component.html',
  styleUrl: './hardware-table.component.scss',
})
export class HardwareTableComponent implements OnInit {
  @ViewChild('hardwareTable') hardwareTable!: Table;
  @Input() autoLoad: boolean = true;
  @Output() editHardware = new EventEmitter<HardwareEquipment>();
  @Output() viewHardware = new EventEmitter<HardwareEquipment>();
  @Output() deleteHardware = new EventEmitter<string>();

  hardwareList: HardwareEquipment[] = [];
  loading: boolean = false;
  error: string = '';

  constructor() {}

  ngOnInit() {
    if (this.autoLoad) {
    }
  }
}
