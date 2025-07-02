import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareTableComponent } from './software-table.component';

describe('SoftwareTableComponent', () => {
  let component: SoftwareTableComponent;
  let fixture: ComponentFixture<SoftwareTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoftwareTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoftwareTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
