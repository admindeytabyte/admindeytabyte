import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardReceivablesComponent } from './dashboard-receivables.component';

describe('DashboardReceivablesComponent', () => {
  let component: DashboardReceivablesComponent;
  let fixture: ComponentFixture<DashboardReceivablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardReceivablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardReceivablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
