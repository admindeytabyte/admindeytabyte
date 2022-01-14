import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertShowDialogComponent } from './alert-show-dialog.component';

describe('AlertShowDialogComponent', () => {
  let component: AlertShowDialogComponent;
  let fixture: ComponentFixture<AlertShowDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertShowDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertShowDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
