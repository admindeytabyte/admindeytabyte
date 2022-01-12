import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceLineEditorComponent } from './invoice-line-editor.component';

describe('InvoiceLineEditorComponent', () => {
  let component: InvoiceLineEditorComponent;
  let fixture: ComponentFixture<InvoiceLineEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceLineEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceLineEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
