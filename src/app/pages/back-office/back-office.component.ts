import { DispatchlogEditorComponent } from './../shared/dispatchlog-editor/dispatchlog-editor.component';
import { AppState } from './../../interfaces/app-state';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { BasePageComponent } from '../base-page/base-page.component';
import { DataService } from '../services/data.service';
import { UserService } from '../services/user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InvoiceDialogComponent } from '../shared/invoice-dialog/invoice-dialog.component';
import { PaymentDialogComponent } from '../shared/payment-dialog/payment-dialog.component';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-back-office',
  templateUrl: './back-office.component.html',
  styleUrls: ['./back-office.component.scss']
})
export class BackOfficeComponent extends BasePageComponent implements OnInit, OnDestroy {
  errorMessage: any;
  screenHeight: number;
  screenWidth: number;
  pickupInvoices: any[];
  dispatchLogs: any[];
  markers: any[] = [];
  mapZoom = 30;
  centerCoordinates: any;
  keys = {};
  controlHeight: number;
  selectedReport: any;
  user: any;
  chartHeight: number;
  logNum: number;
  logId: number;
  invoiceNum: number;
  dialogRef: MatDialogRef<InvoiceDialogComponent>;
  clientPaymentDialogRef: MatDialogRef<PaymentDialogComponent>;
  dispatchEditorDialogRef: MatDialogRef<DispatchlogEditorComponent>;
  confDialogRef: MatDialogRef<ConfirmDialogComponent>;
  constructor(
    store: Store<AppState>,
    private toastr: ToastrService,
    private dataService: DataService,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router
  ) {
    super(store);
    this.onResize();
    this.pageData = {
      title: 'Back Office',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Back Office',
          route: './backoffice'
        },
        {
          title: 'Management'
        }
      ]
    };
    this.editInvoiceClick = this.editInvoiceClick.bind(this);
    this.payInvoiceClick = this.payInvoiceClick.bind(this);
    this.manageLogClick = this.manageLogClick.bind(this);
    this.closeInvoiceClick = this.closeInvoiceClick.bind(this);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.controlHeight = this.screenHeight * .80;
    this.chartHeight = this.screenHeight * .34;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.user = this.userService.getUser();
    if (this.checkRole(45) === false) {
      this.router.navigateByUrl('/vertical/notallowed');
      return;
    }
    this.keys['google'] = 'AIzaSyDE6Th-uxMeqb_abAtNWlXXhUKhP-VZoU8';
    this.user = this.userService.getUser();
    this.refreshPage();
  }

  refreshPage() {
    this.logId=null;
    this.logNum=null;
    this.invoiceNum=null;
    this.dataService.getBackOfficeView(this.user.companyId).subscribe(data => {
      this.pickupInvoices = data.pickups;
      this.dispatchLogs = data.driverLogs;
      this.markers = data.markers;
      // this.dispatchEditorDialogRef = this.dialog.open(DispatchlogEditorComponent, {
      //   data: {
      //     dispatchId: 20475
      //   },
      //   height: '70%',
      //   width: '60%'
      // });
    });
  }

  closeInvoiceClick(e) {
    // Close Invoice without Payment
    e.row.data.updateUserId = this.user.id;
    this.dataService.closeInvoice(e.row.data).subscribe(res => {
      this.toastr.success('Closed on Account', 'PaintCity Inc', { timeOut: 3000 });
      this.refreshPage();
    },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Failed');
    });
    // this.confDialogRef = this.dialog.open(ConfirmDialogComponent, {
    //   data: {
    //     title: 'Confirm',
    //     message: 'Do you want to Close the Invoice without a Payment?'
    //   }, height: '200px', width: '600px', panelClass: 'my-dialog'
    // });

    // const sub = this.confDialogRef.componentInstance.confirmEvent.subscribe((data) => {
    //   if (data === true) {
        
    //   }
    // });

    // this.confDialogRef.afterClosed().subscribe(() => {
    //   sub.unsubscribe();
    // });
  }

  checkRole(roleId: any) {
    return this.userService.checkRole(roleId);
  }

  onDispatchToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
    //   {
    //     location: 'before',
    //     widget: 'dxNumberBox',
    //     options: {
    //       min: '1',
    //       width: 200,
    //       placeholder: 'Open Log',
    //       showSpinButtons: false,
    //       onValueChanged: this.lookUpLog.bind(this)
    //     }
    //   },
      // {
      //   location: 'before',
      //   widget: 'dxButton',
      //   options: {
      //     width: 50,
      //     icon: 'search',
      //     onClick: this.openLog.bind(this)
      //   }
      // },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          hint: 'Refresh',
          onClick: this.refreshPage.bind(this)
        }
      }
    );
  }

  onWalkinsToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          hint: 'Refresh',
          onClick: this.refreshPage.bind(this)
        }
      }
    );
  }

  lookUpLog(e) {
    this.dispatchEditorDialogRef = this.dialog.open(DispatchlogEditorComponent, {
      data: {
        dispatchNum: e.value
      },
      height: '70%',
      width: '60%'
    });

    this.dispatchEditorDialogRef.afterClosed().subscribe(() => {
      this.refreshPage();
    });
  }

  openLogNum(){
    if (this.logNum === null || this.logNum === undefined){
      return;
    }
    this.dispatchEditorDialogRef = this.dialog.open(DispatchlogEditorComponent, {
      data: {
        dispatchNum: this.logNum
      },
      height: '70%',
      width: '60%'
    });

    this.dispatchEditorDialogRef.afterClosed().subscribe(() => {
      this.refreshPage();
    });
  }

  openLogById(){
    if (this.logId === null || this.logId === undefined){
      return;
    }
    this.dataService.getLogNumById(this.logId).subscribe(res => {
      this.dispatchEditorDialogRef = this.dialog.open(DispatchlogEditorComponent, {
        data: {
          dispatchNum: res
        },
        height: '70%',
        width: '60%'
      });
  
      this.dispatchEditorDialogRef.afterClosed().subscribe(() => {
        this.refreshPage();
      });
    },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Failed');
    });
  }

  openLogByInvoice(){
    if (this.invoiceNum === null || this.invoiceNum === undefined){
      return;
    }
    this.dataService.getLogByInvoice(this.invoiceNum,this.user.companyId).subscribe(res => {
      this.dispatchEditorDialogRef = this.dialog.open(DispatchlogEditorComponent, {
        data: {
          dispatchNum: res
        },
        height: '70%',
        width: '60%'
      });
  
      this.dispatchEditorDialogRef.afterClosed().subscribe(() => {
        this.refreshPage();
      });
    },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Failed');
    });
  }


  manageLogClick(e) {
    this.dispatchEditorDialogRef = this.dialog.open(DispatchlogEditorComponent, {
      data: {
        dispatchId: e.row.data.id
      },
      height: '70%',
      width: '60%'
    });

    this.dispatchEditorDialogRef.afterClosed().subscribe(() => {
      this.refreshPage();
    });
  }

  editInvoiceClick(e) {
    this.dialogRef = this.dialog.open(InvoiceDialogComponent, {
      data: {
        invoiceId: e.row.data.invoiceId
      },
      height: '99%',
      width: '95%'
    });

  }

  payInvoiceClick(e) {
    this.clientPaymentDialogRef = this.dialog.open(PaymentDialogComponent, {
      data: {
        accountId: e.row.data.accountId,
        invoiceId: e.row.data.invoiceId
      },
      height: '40%',
      width: '50%',
      panelClass: 'my-dialog'
    });

    this.clientPaymentDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshPage();
      }
    });
  }
}
