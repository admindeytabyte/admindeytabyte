import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceAssemblyDialogComponent } from './invoice-assembly-dialog.component';

describe('InvoiceAssemblyDialogComponent', () => {
  let component: InvoiceAssemblyDialogComponent;
  let fixture: ComponentFixture<InvoiceAssemblyDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceAssemblyDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceAssemblyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
