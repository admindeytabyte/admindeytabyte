import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLinesEditorComponent } from './product-lines-editor.component';

describe('ProductLinesEditorComponent', () => {
  let component: ProductLinesEditorComponent;
  let fixture: ComponentFixture<ProductLinesEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductLinesEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLinesEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
