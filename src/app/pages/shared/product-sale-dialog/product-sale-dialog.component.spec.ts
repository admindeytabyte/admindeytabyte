import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSaleDialogComponent } from './product-sale-dialog.component';

describe('ProductSaleDialogComponent', () => {
  let component: ProductSaleDialogComponent;
  let fixture: ComponentFixture<ProductSaleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSaleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSaleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
