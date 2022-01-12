import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/interfaces/app-state';
import { BasePageComponent } from '../base-page/base-page.component';
import { DataService } from '../services/data.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent extends BasePageComponent implements OnInit, OnDestroy {

  constructor(
    store: Store<AppState>,
    private dataService: DataService,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router,
    public datepipe: DatePipe
  ) {
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

}
