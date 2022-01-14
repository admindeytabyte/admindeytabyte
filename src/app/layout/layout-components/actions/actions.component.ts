
import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppSettings } from '../../../interfaces/settings';
import { AppState } from '../../../interfaces/app-state';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DepositLogReportComponent } from '../../../pages/reports/deposit-log-report/deposit-log-report.component';
import { ProfileDialogComponent } from '../../../pages/shared/profile-dialog/profile-dialog.component';
import { NewQuoteDialogComponent } from '../../../pages/shared/new-quote-dialog/new-quote-dialog.component';
import { UserService } from '../../../pages/services/user.service';
import { AuthenticationService } from '../../../pages/services/authentication.service';


@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit {
  appSettings: AppSettings;
  closeDropdown: EventEmitter<boolean>;
  dialogRef: MatDialogRef<NewQuoteDialogComponent>;
  profileDialogRef: MatDialogRef<ProfileDialogComponent>;
  depositsDialogRef: MatDialogRef<DepositLogReportComponent>;
  user: any;
  errorMessage: any;
  selectedCompany: any;
  companies: any[];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private store: Store<AppState>,
    private userService: UserService,
    private authService: AuthenticationService
  ) {
    this.closeDropdown = new EventEmitter<boolean>();
    this.companies = [];
  }

  ngOnInit() {
    this.store.select('appSettings').subscribe(settings => {
      this.appSettings = settings;
    });
    this.user = this.userService.getUser();
    if (this.user === null || this.user === undefined) {
      this.router.navigate(['extra', 'login']);
    }

    this.authService.getCompaniesForUser(this.user.id).subscribe(data => {
      this.companies = data;
    });

   
  }

  changeCompany() {

    if (this.selectedCompany === null || this.selectedCompany === undefined) {
      return;
    }

    this.authService.setCompany(this.selectedCompany);

  }

  showRoles() {
    this.profileDialogRef = this.dialog.open(ProfileDialogComponent, {
      height: '90%',
      width: '40%',
    });
  }


  logoutClicked() {
    this.authService.logout(this.user)
    .subscribe(
      r => {
    localStorage.clear();
    this.router.navigate(['extra', 'login']);
    });
  }

    
  

  onCloseDropdown() {
    this.closeDropdown.emit(true);
  }

  goTo(event: Event, link: string, layout: string = 'vertical') {
    event.preventDefault();
    this.onCloseDropdown();

    if (link === 'logout') {
      this.authService.logout(this.user);
      setTimeout(() => {
        this.router.navigate([layout, link]);
      });
    } 
    else if (link === 'roles') {
      this.showRoles();
    }
    else if (link === 'deposits') {
      this.depositsDialogRef = this.dialog.open(DepositLogReportComponent,
        {
          height: '90%',
          width: '40%',
        });
    
    }
  }
}
