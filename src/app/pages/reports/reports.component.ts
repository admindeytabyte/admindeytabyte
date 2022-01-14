import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './../../interfaces/app-state';
import { BasePageComponent } from '../base-page/base-page.component';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../services/data.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent extends BasePageComponent implements OnInit, OnDestroy {
  errorMessage: any;
  screenHeight: number;
  screenWidth: number;
  reports: any[];
  controlHeight: number;
  selectedReport: any;
  user: any;
  constructor(
    store: Store<AppState>,
    private toastr: ToastrService,
    private dataService: DataService,
    private userService: UserService,
    private router: Router
  ) {
    super(store);
    this.onResize();
    this.pageData = {
      title: 'Reports',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Reports',
          route: './reports'
        }
      ]
    };
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.controlHeight = this.screenHeight * .85;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.user = this.userService.getUser();
    if (this.checkRole(37) === false) {
      this.router.navigateByUrl('/vertical/notallowed');
      return;
    }
    this.dataService.getReports().subscribe(data => {
      this.reports = data;
      this.selectedReport = data.filter(f => f.reportId === 1)[0];
    });
  }

  checkRole(roleId: any) {
    return this.userService.checkRole(roleId);
  }

  getReports(e) {
    return e.data.reports;
  }

  reportFocusChanged(e) {
    this.selectedReport = e.row.data;
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
