import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchlogEditorComponent } from './dispatchlog-editor.component';

describe('DispatchlogEditorComponent', () => {
  let component: DispatchlogEditorComponent;
  let fixture: ComponentFixture<DispatchlogEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispatchlogEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchlogEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
