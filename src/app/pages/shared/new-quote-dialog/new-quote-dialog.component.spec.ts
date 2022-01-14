import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewQuoteDialogComponent } from './new-quote-dialog.component';

describe('NewQuoteDialogComponent', () => {
  let component: NewQuoteDialogComponent;
  let fixture: ComponentFixture<NewQuoteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewQuoteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewQuoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
