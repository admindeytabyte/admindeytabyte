import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchSummaryReportComponent } from './dispatch-summary-report.component';

describe('DispatchSummaryReportComponent', () => {
  let component: DispatchSummaryReportComponent;
  let fixture: ComponentFixture<DispatchSummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispatchSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
