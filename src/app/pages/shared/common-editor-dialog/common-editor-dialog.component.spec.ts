import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonEditorDialogComponent } from './common-editor-dialog.component';

describe('CommonEditorDialogComponent', () => {
  let component: CommonEditorDialogComponent;
  let fixture: ComponentFixture<CommonEditorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonEditorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
