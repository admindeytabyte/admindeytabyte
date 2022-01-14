import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementsReportComponent } from './statements-report.component';

describe('StatementsReportComponent', () => {
  let component: StatementsReportComponent;
  let fixture: ComponentFixture<StatementsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatementsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
