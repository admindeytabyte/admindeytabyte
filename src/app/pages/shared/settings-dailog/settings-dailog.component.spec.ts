import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsDailogComponent } from './settings-dailog.component';

describe('SettingsDailogComponent', () => {
  let component: SettingsDailogComponent;
  let fixture: ComponentFixture<SettingsDailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsDailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
