import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoviewerDialogComponent } from './poviewer-dialog.component';

describe('PoviewerDialogComponent', () => {
  let component: PoviewerDialogComponent;
  let fixture: ComponentFixture<PoviewerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoviewerDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoviewerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
