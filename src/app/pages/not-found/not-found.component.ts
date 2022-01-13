import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { BasePageComponent } from '../base-page/base-page.component';
import { AppState } from '../../interfaces/app-state';

@Component({
  selector: 'page-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class PageNotFoundComponent extends BasePageComponent implements OnInit, OnDestroy {

  constructor(
    store: Store<AppState>
  ) {
    super(store);

    this.pageData = {
      title: 'Page not found',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Main',
          route: './dashboard'
        },
        {
          title: 'Page not found'
        }
      ]
    };
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
