import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TCFileComponent } from './file.component';

describe('TCFileComponent', () => {
  let component: TCFileComponent;
  let fixture: ComponentFixture<TCFileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TCFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
