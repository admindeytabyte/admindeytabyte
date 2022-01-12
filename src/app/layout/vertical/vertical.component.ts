import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseLayoutComponent } from '../base-layout/base-layout.component';
import { AppState } from '../../interfaces/app-state';

@Component({
  selector: 'vertical-layout',
  templateUrl: './vertical.component.html',
  styleUrls: [
    '../base-layout/base-layout.component.scss',
    './vertical.component.scss'
  ]
})
export class VerticalLayoutComponent extends BaseLayoutComponent implements OnInit {
  openedAddition: boolean;

  constructor(store: Store<AppState>) {
    super(store);

    this.openedAddition = false;
  }

  ngOnInit() {
    super.ngOnInit();
  }

  toggleAddition(bool: boolean) {
    this.openedAddition = bool;
  }
}
