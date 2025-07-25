import { ChangeDetectorRef, Component, ViewChild, OnInit } from '@angular/core';
import { ImportsModule } from '../../../../imports';
import { ConfirmationService, MessageService } from 'primeng/api';


import { AlertService } from '../../../../core/services/alert.service';


@Component({
  selector: 'app-equipment',
  imports: [
    ImportsModule,
    
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './equipment.component.html',
  styleUrl: './equipment.component.scss',
  styles: [
    `
      :host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
      }
    `,
  ],
})
export class EquipmentComponent implements OnInit {
  assets: any[] = [];
  loading: boolean = false;
  error: string = '';
  showAddForm: boolean = false;



  // Table display properties
  showTableSection: boolean = false;
  showCategorySelection: boolean = false;
  selectedCategory: 'hardware' | 'software' | null = null;

  constructor(
    private alertService: AlertService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // Load asset types first, then load equipment data
  }

 
}