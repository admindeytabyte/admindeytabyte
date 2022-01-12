import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePrintDialogComponent } from './invoice-print-dialog.component';

describe('InvoicePrintDialogComponent', () => {
  let component: InvoicePrintDialogComponent;
  let fixture: ComponentFixture<InvoicePrintDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicePrintDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePrintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
