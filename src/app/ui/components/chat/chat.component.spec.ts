import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TCChatComponent } from './chat.component';

describe('TCChatComponent', () => {
  let component: TCChatComponent;
  let fixture: ComponentFixture<TCChatComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TCChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TCChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
