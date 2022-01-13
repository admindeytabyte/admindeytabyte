import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormuleaEditorComponent } from './formulea-editor.component';

describe('FormuleaEditorComponent', () => {
  let component: FormuleaEditorComponent;
  let fixture: ComponentFixture<FormuleaEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormuleaEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormuleaEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
