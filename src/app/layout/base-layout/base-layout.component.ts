import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import * as SettingsActions from '../../store/actions/app-settings.actions';
import { PageData } from '../../interfaces/page-data';
import { AppState } from '../../interfaces/app-state';
import { AppSettings } from '../../interfaces/settings';

@Component({
  selector: 'base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.scss']
})
export class BaseLayoutComponent implements OnInit {
  pageData: PageData;
  appSettings: AppSettings;
  loaded: boolean;

  constructor(public store: Store<AppState>) {

  }

  ngOnInit() {
    this.store.select('pageData').subscribe(data => {
      setTimeout(() => {
        this.pageData = data ? data : null;
        data.loaded ? this.loaded = true : null;
      });
    });
    this.store.select('appSettings').subscribe(settings => {
      this.appSettings = settings;
      document.documentElement.setAttribute('dir', this.appSettings.rtl ? 'rtl' : 'ltr');
    });
  }

  toggleSidebar(value: boolean) {
    this.store.dispatch(new SettingsActions.SidebarState(value));
  }

  getClasses() {
    return {
      [this.appSettings.menuType]: true,
      'boxed': this.appSettings.boxed,
      'compress-vertical-navbar': this.appSettings.sidebarCompress,
      'open-sidebar': this.appSettings.sidebarOpened,
      'rtl': this.appSettings.rtl,
      'with-top-navbar': this.appSettings.showTopNavbar
    };
  }
}
