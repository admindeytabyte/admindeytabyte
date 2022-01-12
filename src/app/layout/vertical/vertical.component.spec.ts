import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { VerticalLayoutComponent } from './vertical.component';

describe('VerticalLayoutComponent', () => {
  let component: VerticalLayoutComponent;
  let fixture: ComponentFixture<VerticalLayoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VerticalLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
