import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientInvoicePaymentsEditorComponent } from './client-invoice-payments-editor.component';

describe('ClientInvoicePaymentsEditorComponent', () => {
  let component: ClientInvoicePaymentsEditorComponent;
  let fixture: ComponentFixture<ClientInvoicePaymentsEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientInvoicePaymentsEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientInvoicePaymentsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
