import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintcodeEditorComponent } from './paintcode-editor.component';

describe('PaintcodeEditorComponent', () => {
  let component: PaintcodeEditorComponent;
  let fixture: ComponentFixture<PaintcodeEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaintcodeEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintcodeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
