import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositLogReportComponent } from './deposit-log-report.component';

describe('DepositLogReportComponent', () => {
  let component: DepositLogReportComponent;
  let fixture: ComponentFixture<DepositLogReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositLogReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositLogReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
