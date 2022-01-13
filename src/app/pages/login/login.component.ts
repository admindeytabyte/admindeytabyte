import { DataService } from './../services/data.service';
import { UserService } from './../services/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { BasePageComponent } from '../base-page/base-page.component';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AppState } from '../../interfaces/app-state';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BasePageComponent implements OnInit, OnDestroy {
  // loginId = 'iffy';
  // password = 'farraiashh';
  loginId = '';
  password = '';
  errorMessage: any;
  loadingVisible = false;
  ipAddress: any;
  companies: any[];
  user: any;
  selectedCompany: any;
  version: any;
  warning: any;

  constructor(store: Store<AppState>,
    private authService: AuthenticationService,
    private dataService: DataService,
    private userService: UserService,
    private router: Router) {
    super(store);

    this.pageData = {
      title: '',
      loaded: true,
      breadcrumbs: []
    }
    this.version = environment.version;
  }

  ngOnInit(): void {
    super.ngOnInit();
    //Check existing Login
    this.loginId='';
    this.password='';
    this.user = this.userService.getUser();
    if (this.user !== null) {
      this.router.navigateByUrl('/vertical/dashboard-home');
      return;
    }

    this.dataService.getCompanies().subscribe(data => {
      this.companies = data;
      this.getIP();
    });
  }

  getIP() {
    this.authService.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res !== undefined ? res.ip : 'IpError';
    });
  }

  passwordEntered(e) {
    this.tryLogin();
  }

  tryLogin() {

    if (this.loginId.length === 0) {
      this.errorMessage = 'UserId is required';
      return;
    }

    if (this.password.length === 0) {
      this.errorMessage = 'Password is required';
      return;
    }

    const loginParams = {
      companyId: this.selectedCompany.companyId,
      username: this.loginId,
      password: this.password,
      ipAddress: this.ipAddress
    };

    this.loadingVisible = true;
    this.authService.login(loginParams)
      .subscribe(
        r => {
          this.loadingVisible = false;
          if (r.errorCode === 0) {
            // Success
            if (r.defaultScreen === 'Sales'){
              this.router.navigateByUrl('/vertical/salesmanagement');
            }
            else{
              this.router.navigateByUrl('/vertical/dashboard-home');
            }
            
          } else if (r.errorCode === 1) {
            this.errorMessage = 'Unauthourized';
          } else {
            this.errorMessage = 'ID is not Authourized for ' + this.selectedCompany.companyName;
          }
        },
        r => {
          this.loadingVisible = false;
        });
    }
  
    ngOnDestroy() {
    super.ngOnDestroy();
  }
}
