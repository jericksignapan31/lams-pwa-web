import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  EquipmentService,
  ASSET_TYPES,
} from '../../services/equipment.service';

interface SoftwareEquipment {
  id?: string;
  software_name: string;
  version: string;
  license_key?: string;
  license_count?: number | null;
  vendor: string;
  license_expiry_date?: Date | string | null;
  assigned_to?: string;
  date_acquired?: Date | string | null;
  unit_cost?: number | null;
  laboratory?: any;
  laboratory_name?: string;
  campus?: string;
}

@Component({
  selector: 'app-software-table',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    ProgressSpinnerModule,
    MessageModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './software-table.component.html',
  styleUrl: './software-table.component.scss',
})
export class SoftwareTableComponent {

}
