import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRelatedEditorComponent } from './product-related-editor.component';

describe('ProductRelatedEditorComponent', () => {
  let component: ProductRelatedEditorComponent;
  let fixture: ComponentFixture<ProductRelatedEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductRelatedEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRelatedEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
