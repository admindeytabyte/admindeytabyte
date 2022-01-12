import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImagesEditorComponent } from './product-images-editor.component';

describe('ProductImagesEditorComponent', () => {
  let component: ProductImagesEditorComponent;
  let fixture: ComponentFixture<ProductImagesEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductImagesEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductImagesEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
