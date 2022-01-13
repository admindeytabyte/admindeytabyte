import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientInvoicesDialogComponent } from './client-invoices-dialog.component';

describe('ClientInvoicesDialogComponent', () => {
  let component: ClientInvoicesDialogComponent;
  let fixture: ComponentFixture<ClientInvoicesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientInvoicesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientInvoicesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
