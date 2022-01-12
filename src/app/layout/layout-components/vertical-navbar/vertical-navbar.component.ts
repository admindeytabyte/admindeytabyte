import { Component, HostBinding, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { AppSettings } from '../../../interfaces/settings';
import { AppState } from '../../../interfaces/app-state';
import * as SettingsActions from '../../../store/actions/app-settings.actions';

@Component({
  selector: 'app-vertical-navbar',
  templateUrl: 'vertical-navbar.component.html',
  styleUrls: ['vertical-navbar.component.scss']
})
export class VerticalNavbarComponent implements OnInit {
  @HostBinding('class') get class() {
    return 'app-v-navbar';
  }

  appSettings: AppSettings;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.select('appSettings').subscribe(settings => {
      this.appSettings = settings;
    });
  }

  toggleNavbar(value: boolean) {
    this.store.dispatch(new SettingsActions.SidebarState(value));
  }
}
