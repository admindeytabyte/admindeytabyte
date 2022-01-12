import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityBreaksComponent } from './quantity-breaks.component';

describe('QuantityBreaksComponent', () => {
  let component: QuantityBreaksComponent;
  let fixture: ComponentFixture<QuantityBreaksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuantityBreaksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantityBreaksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
