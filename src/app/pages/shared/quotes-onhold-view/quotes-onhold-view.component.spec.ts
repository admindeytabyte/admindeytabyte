import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotesOnholdViewComponent } from './quotes-onhold-view.component';

describe('QuotesOnholdViewComponent', () => {
  let component: QuotesOnholdViewComponent;
  let fixture: ComponentFixture<QuotesOnholdViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotesOnholdViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotesOnholdViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
