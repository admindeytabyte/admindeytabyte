import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { debounceTime } from 'rxjs/operators';

import { AppSettings } from '../../../interfaces/settings';
import { AppState } from '../../../interfaces/app-state';
import * as SettingsActions from '../../../store/actions/app-settings.actions';

export interface SettingsSelect {
  label: string;
  value: string;
}
@Component({
  selector: 'app-addition-navbar',
  templateUrl: './addition-navbar.component.html',
  styleUrls: ['./addition-navbar.component.scss']
})
export class AdditionNavbarComponent implements OnInit {
  @HostBinding('class') get class() {
    return 'app-addition-navbar';
  }
  @HostBinding('class.open') get navbarOpen() {
    return  this.opened;
  };

  @Input() opened: boolean;
  @Input() title: string;

  @Output() open: EventEmitter<boolean>;

  appSettings: AppSettings;
  settingsForm: FormGroup;
  crumbsStyles: SettingsSelect[];
  menuStyles: SettingsSelect[];

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder
  ) {
    this.open = new EventEmitter<boolean>();
    this.opened = false;
    this.crumbsStyles = [
      {
        label: 'Default',
        value: 'default'
      },
      {
        label: 'Custom 1',
        value: 'custom1'
      },
      {
        label: 'Custom 2',
        value: 'custom2'
      }
    ];
    this.menuStyles = [
      {
        label: 'Style 1',
        value: 'menu-style-1'
      },
      {
        label: 'Style 2',
        value: 'menu-style-2'
      },
      {
        label: 'Style 3',
        value: 'menu-style-3'
      },
      {
        label: 'Style 4',
        value: 'menu-style-4'
      }
    ];
  }

  ngOnInit() {
    this.store.select('appSettings').subscribe(settings => {
      this.appSettings = settings;
    });

    this.initSettingsForm(this.appSettings);
  }

  openNavbar() {
    this.opened = !this.opened;
    this.open.emit(this.opened);
  }

  initSettingsForm(data: AppSettings) {
    this.settingsForm = this.fb.group({
      boxed: [data.boxed ? data.boxed : false],
      sidebarCompress: [data.sidebarCompress ? data.sidebarCompress : false],
      rtl: [data.rtl ? data.rtl : false],
      showTitle: [data.showTitle ? data.showTitle : true],
      showTopNavbar: [data.showTopNavbar ? data.showTopNavbar : true],
      showCrumbs: [data.showCrumbs ? data.showCrumbs : true],
      crumbsType: [data.crumbsType ? data.crumbsType : 'custom1'],
      menuType: [data.menuType ? data.menuType : 'menu-style-3']
    });

    this.settingsForm.valueChanges.pipe(debounceTime(500)).subscribe((settingsObj) => {
      this.store.dispatch(new SettingsActions.Update(settingsObj));
    });
  }
}
