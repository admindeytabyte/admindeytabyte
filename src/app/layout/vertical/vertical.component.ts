import { Component, OnInit } from '@angular/core';
import { BaseLayoutComponent } from '../base-layout/base-layout.component';
import { AppState } from '../../interfaces/app-state';
import { Store } from '@ngrx/store';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from '../../pages/services/user.service';
import { DataService } from '../../pages/services/data.service';
import { AlertDialogComponent } from '../../pages/shared/alert-dialog/alert-dialog.component';
import { QuotesOnholdViewComponent } from '../../pages/shared/quotes-onhold-view/quotes-onhold-view.component';
import { SettingsDailogComponent } from '../../pages/shared/settings-dailog/settings-dailog.component';
import { NewQuoteDialogComponent } from '../../pages//shared/new-quote-dialog/new-quote-dialog.component';
import { AuthenticationService } from '../../pages//services/authentication.service';
import { AlertShowDialogComponent } from '../../pages//shared/alert-show-dialog/alert-show-dialog.component';
import { SecurityDialogComponent } from 'src/app/pages/shared/security-dialog/security-dialog.component';
import { IdleDialogComponent } from 'src/app/pages/shared/idle-dialog/idle-dialog.component';

@Component({
  selector: 'vertical-layout',
  templateUrl: './vertical.component.html',
  styleUrls: [
    '../base-layout/base-layout.component.scss',
    './vertical.component.scss'
  ]
})
export class VerticalLayoutComponent extends BaseLayoutComponent implements OnInit {
  settingsDialogRef: MatDialogRef<SettingsDailogComponent>;
  securityDialogRef: MatDialogRef<SecurityDialogComponent>;
  onHoldDialogRef: MatDialogRef<QuotesOnholdViewComponent>;
  alertsDialogRef: MatDialogRef<AlertDialogComponent>;
  dialogRef: MatDialogRef<NewQuoteDialogComponent>;
  idleDialogRef: MatDialogRef<IdleDialogComponent>;
  alertDialogRef: MatDialogRef<AlertShowDialogComponent>;
  openedAddition: boolean;
  user: any;
  alertCount = 0;
  onHoldCount = 0;
  logoUrl: string;
  alertInterval: any;
  alerts: any[] = [];
  timeLeft: number;
  constructor(store: Store<AppState>,
    private dialog: MatDialog,
    private dataService: DataService,
    private userService: UserService,
    private authService: AuthenticationService,
    private router: Router) {
    super(store);
    this.openedAddition = false;
    this.user = this.userService.getUser();
  }

  ngOnInit() {
    super.ngOnInit();
    this.user = this.userService.getUser();
    this.logoUrl = this.user.companyId >= 3 ? 'assets/img/logo3P.png' : 'assets/img/iffylogo.jpg';
    this.refreshHeader();
    //this.checkAlerts();
    this.startAlertTimer();
    // this.newQuoteClicked();
    // this.onHoldClicked();
    //this.securityClicked();

  }

  refreshHeader() {
    this.dataService.getHeaderCounts(this.user.companyId, this.user.id).subscribe(data => {
      this.alertCount = data.alertCount;
      this.onHoldCount = data.onHoldCount;
    });
  }

  startAlertTimer() {
    this.alertInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 60;
        this.checkAlerts();
      }
    }, 1000)
  }

  checkAlerts() {
    this.dataService.getAlerts(this.user.id).subscribe(data => {
      data.forEach(item => {

        this.alertDialogRef = this.dialog.open(AlertShowDialogComponent, {
          data: {
            alert: item
          },
          height: '40%',
          width: '25%',
          panelClass: 'my-dialog'
        });
      });
      });
  }

  newQuoteClicked() {
    this.dialogRef = this.dialog.open(NewQuoteDialogComponent, {
      height: '80%',
      width: '60%',
      panelClass: 'my-dialog'
    });
  }

  logoutClicked() {
    clearTimeout(this.alertInterval);
    this.authService.logout(this.user)
    .subscribe(
      r => {
    localStorage.clear();
    this.router.navigate(['extra', 'login']);
    });
  }

  checkIdle(){
    // this.idleDialogRef = this.dialog.open(IdleDialogComponent, {
    //   height: '20%',
    //   width: '30%'
    // });
    this.checkAlerts();
  }

  homeClicked() {
    this.router.navigateByUrl('/vertical/dashboard-home');
  }

  customersClicked() {
    this.router.navigateByUrl('/vertical/customers');
  }

  productsClicked() {
    this.router.navigateByUrl('/vertical/products');
  }

  dispatchClicked() {
    this.router.navigateByUrl('/vertical/dispatch');
  }

  backOfficeClicked() {
    this.router.navigateByUrl('/vertical/backoffice');
  }

  checkRole(roleId: any) {
    return this.userService.checkRole(roleId);
  }

  openAlertsClicked() {
    this.alertsDialogRef = this.dialog.open(AlertDialogComponent, {
      height: '50%',
      width: '60%',
      panelClass: 'my-dialog'
    });
  }

  onHoldClicked() {
    this.onHoldDialogRef = this.dialog.open(QuotesOnholdViewComponent, {
      height: '80%',
      width: '60%',
      panelClass: 'my-dialog'
    });
  }

  settingsClicked() {
    this.settingsDialogRef = this.dialog.open(SettingsDailogComponent, {
      height: '50%',
      width: '50%',
      panelClass: 'my-dialog'
    });
  }

  securityClicked() {
    this.securityDialogRef = this.dialog.open(SecurityDialogComponent, {
      height: '80%',
      width: '70%',
      panelClass: 'my-dialog'
    });
  }


  toggleAddition(bool: boolean) {
    this.openedAddition = bool;
  }
}
