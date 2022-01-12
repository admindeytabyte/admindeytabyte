import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { PageData } from '../../interfaces/page-data';
import { AppState } from '../../interfaces/app-state';
import * as PageActions from '../../store/actions/page.actions';

@Component({
  selector: 'base-page',
  templateUrl: './base-page.component.html',
  styleUrls: ['./base-page.component.scss']
})
export class BasePageComponent implements OnInit, OnDestroy {
  pageData: PageData;

  @HostBinding('style.display') get style() {
    return 'block';
  }

  constructor(public store: Store<AppState>) { }

  ngOnInit() {
    if (this.pageData)  {
      this.store.dispatch(new PageActions.Set(this.pageData));
    }
  }

  ngOnDestroy() {
    this.store.dispatch(new PageActions.Reset());
  }

  setLoaded(during: number = 0) {
    setTimeout(() => this.store.dispatch(new PageActions.Update({ loaded: true })), during);
  }
}
