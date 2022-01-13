import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCommissionsDialogComponent } from './client-commissions-dialog.component';

describe('ClientCommissionsDialogComponent', () => {
  let component: ClientCommissionsDialogComponent;
  let fixture: ComponentFixture<ClientCommissionsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientCommissionsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientCommissionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
