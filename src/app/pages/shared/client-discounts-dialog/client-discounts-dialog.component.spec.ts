import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDiscountsDialogComponent } from './client-discounts-dialog.component';

describe('ClientDiscountsDialogComponent', () => {
  let component: ClientDiscountsDialogComponent;
  let fixture: ComponentFixture<ClientDiscountsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientDiscountsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDiscountsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
