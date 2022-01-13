import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintCodesComponent } from './paint-codes.component';

describe('PaintCodesComponent', () => {
  let component: PaintCodesComponent;
  let fixture: ComponentFixture<PaintCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaintCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
