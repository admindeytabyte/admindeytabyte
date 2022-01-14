import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesBylineReportComponent } from './sales-byline-report.component';

describe('SalesBylineReportComponent', () => {
  let component: SalesBylineReportComponent;
  let fixture: ComponentFixture<SalesBylineReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesBylineReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesBylineReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
