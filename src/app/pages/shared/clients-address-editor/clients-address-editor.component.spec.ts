import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsAddressEditorComponent } from './clients-address-editor.component';

describe('ClientsAddressEditorComponent', () => {
  let component: ClientsAddressEditorComponent;
  let fixture: ComponentFixture<ClientsAddressEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientsAddressEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientsAddressEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
