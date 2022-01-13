import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingAssemblyDialogComponent } from './pending-assembly-dialog.component';

describe('PendingAssemblyDialogComponent', () => {
  let component: PendingAssemblyDialogComponent;
  let fixture: ComponentFixture<PendingAssemblyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingAssemblyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingAssemblyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
