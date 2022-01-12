import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSlabEditorComponent } from './product-slab-editor.component';

describe('ProductSlabEditorComponent', () => {
  let component: ProductSlabEditorComponent;
  let fixture: ComponentFixture<ProductSlabEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSlabEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSlabEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
