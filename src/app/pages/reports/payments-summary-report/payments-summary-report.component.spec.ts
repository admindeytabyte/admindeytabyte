import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsSummaryReportComponent } from './payments-summary-report.component';

describe('PaymentsSummaryReportComponent', () => {
  let component: PaymentsSummaryReportComponent;
  let fixture: ComponentFixture<PaymentsSummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentsSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
