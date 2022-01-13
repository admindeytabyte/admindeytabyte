import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTransactionsComponent } from './client-transactions.component';

describe('ClientTransactionsComponent', () => {
  let component: ClientTransactionsComponent;
  let fixture: ComponentFixture<ClientTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
