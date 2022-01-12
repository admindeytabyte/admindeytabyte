import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/interfaces/app-state';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent extends BasePageComponent implements OnInit, OnDestroy {

  constructor(
    store: Store<AppState>) 
    {
    super(store);
    this.pageData = {
      title: 'Dashboard Home',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Dashboards',
          route: './dashboard-home'
        },
        {
          title: 'Home'
        }
      ]
    };
   }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnDestroy() {
    //clearInterval(this.interval);
    super.ngOnDestroy();
  }

}
