import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesCommReportComponent } from './sales-comm-report.component';

describe('SalesCommReportComponent', () => {
  let component: SalesCommReportComponent;
  let fixture: ComponentFixture<SalesCommReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesCommReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesCommReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
