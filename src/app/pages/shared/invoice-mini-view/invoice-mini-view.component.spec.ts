import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceMiniViewComponent } from './invoice-mini-view.component';

describe('InvoiceMiniViewComponent', () => {
  let component: InvoiceMiniViewComponent;
  let fixture: ComponentFixture<InvoiceMiniViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceMiniViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceMiniViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
