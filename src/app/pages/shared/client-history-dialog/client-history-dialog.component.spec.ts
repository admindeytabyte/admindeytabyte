import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientHistoryDialogComponent } from './client-history-dialog.component';

describe('ClientHistoryDialogComponent', () => {
  let component: ClientHistoryDialogComponent;
  let fixture: ComponentFixture<ClientHistoryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientHistoryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
