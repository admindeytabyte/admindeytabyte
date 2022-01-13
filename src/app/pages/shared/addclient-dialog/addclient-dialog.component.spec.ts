import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddclientDialogComponent } from './addclient-dialog.component';

describe('AddclientDialogComponent', () => {
  let component: AddclientDialogComponent;
  let fixture: ComponentFixture<AddclientDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddclientDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddclientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
