import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdditionNavbarComponent } from './addition-navbar.component';

describe('AdditionNavbarComponent', () => {
  let component: AdditionNavbarComponent;
  let fixture: ComponentFixture<AdditionNavbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
