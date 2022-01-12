import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingSlipDialogComponent } from './packing-slip-dialog.component';

describe('PackingSlipDialogComponent', () => {
  let component: PackingSlipDialogComponent;
  let fixture: ComponentFixture<PackingSlipDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackingSlipDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingSlipDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
