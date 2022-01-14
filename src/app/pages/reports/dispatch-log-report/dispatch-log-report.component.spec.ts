import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchLogReportComponent } from './dispatch-log-report.component';

describe('DispatchLogReportComponent', () => {
  let component: DispatchLogReportComponent;
  let fixture: ComponentFixture<DispatchLogReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispatchLogReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchLogReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
