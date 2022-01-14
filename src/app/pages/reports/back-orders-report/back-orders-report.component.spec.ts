import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackOrdersReportComponent } from './back-orders-report.component';

describe('BackOrdersReportComponent', () => {
  let component: BackOrdersReportComponent;
  let fixture: ComponentFixture<BackOrdersReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackOrdersReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackOrdersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
