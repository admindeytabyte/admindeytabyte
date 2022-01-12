import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBatchDialogComponent } from './product-batch-dialog.component';

describe('ProductBatchDialogComponent', () => {
  let component: ProductBatchDialogComponent;
  let fixture: ComponentFixture<ProductBatchDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductBatchDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBatchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
