import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { BaseLayoutComponent } from '../base-layout/base-layout.component';
import { AppState } from '../../interfaces/app-state';

@Component({
  selector: 'extra-layout',
  templateUrl: 'extra.component.html',
  styleUrls: [
    '../base-layout/base-layout.component.scss',
    'extra.component.scss'
  ]
})
export class ExtraLayoutComponent extends BaseLayoutComponent implements OnInit {
  constructor(store: Store<AppState>) {
    super(store);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
