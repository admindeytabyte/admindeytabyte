import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { AppSettings } from '../../../interfaces/settings';
import { AppState } from '../../../interfaces/app-state';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {
  appSettings: AppSettings;
  closeDropdown: EventEmitter<boolean>;

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {
    this.closeDropdown = new EventEmitter<boolean>();
  }

  ngOnInit() {
    this.store.select('appSettings').subscribe(settings => {
      this.appSettings = settings;
    });
  }

  onCloseDropdown() {
    this.closeDropdown.emit(true);
  }

  goTo(event: Event, link: string, layout: string = 'vertical') {
    event.preventDefault();

    this.onCloseDropdown();

    setTimeout(() => {
      this.router.navigate([layout, link]);
    });
  }
}
