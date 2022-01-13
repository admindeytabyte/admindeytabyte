import { ToastrService } from 'ngx-toastr';
import { CommonEditorDialogComponent } from './../shared/common-editor-dialog/common-editor-dialog.component';
import { InvoiceAssemblyDialogComponent } from './../shared/invoice-assembly-dialog/invoice-assembly-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Marker } from './../../interfaces/maps';
import { DataService } from './../services/data.service';
import { UserService } from './../services/user.service';
import { Store } from '@ngrx/store';
import { AppState } from './../../interfaces/app-state';
import { BasePageComponent } from './../base-page/base-page.component';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Router } from '@angular/router';
import { PackingSlipDialogComponent } from '../shared/packing-slip-dialog/packing-slip-dialog.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { PaymentDialogComponent } from '../shared/payment-dialog/payment-dialog.component';
import { InvoiceDialogComponent } from '../shared/invoice-dialog/invoice-dialog.component';
import { MessageDialogComponent } from '../shared/message-dialog/message-dialog.component';
import { PendingAssemblyDialogComponent } from '../shared/pending-assembly-dialog/pending-assembly-dialog.component';
//import { Console } from 'console';

@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss']
})


export class DispatchComponent extends BasePageComponent implements OnInit, OnDestroy {
  errorMessage: any;
  editRowKey: any;
  dispatchLogs: any[] = [];
  shippingLogs: any[] = [];
  invoices: any[] = [];
  dispatchStatuses: any[] = [];
  deliveryInvoices: any[] = [];
  pickupInvoices: any[] = [];
  shippingInvoices: any[] = [];
  markers: any[] = [];
  keys = {};
  isBusy = false;
  filteredInvoices: any[] = [];
  filteredMarkers: any[] = [];
  invoiceCounts: any[];
  shippingZones: any[];
  dispatchList: any[] = [];
  shippingLogList: any[] = [];
  drivers: any[];
  carriers: any[];
  packageTypes: any[];
  user: any;
  mapZoom = 100;
  timeLeft = 120;
  interval: any;
  centerCoordinates: any;
  worldMap: any;
  screenHeight: number;
  screenWidth: number;
  chartHeight: number;
  chartHeight2: number;
  gridHeight: number;
  dialogRef: MatDialogRef<InvoiceAssemblyDialogComponent>;
  pendingItemsdialogRef: MatDialogRef<PendingAssemblyDialogComponent>;
  //dispatchLogdialogRef: MatDialogRef<DispatchLogReportComponent>;
  packingDialogRef: MatDialogRef<PackingSlipDialogComponent>;
  clientDialogRef: MatDialogRef<CommonEditorDialogComponent>;
  confDialogRef: MatDialogRef<ConfirmDialogComponent>;
  clientPaymentDialogRef: MatDialogRef<PaymentDialogComponent>;
  invoicedialogRef: MatDialogRef<InvoiceDialogComponent>;
  messageDialog: MatDialogRef<MessageDialogComponent>;


  constructor(
    store: Store<AppState>,
    private userService: UserService,
    private dataService: DataService,
    private dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService
  ) {
    super(store);
    this.keys['google'] = 'AIzaSyDE6Th-uxMeqb_abAtNWlXXhUKhP-VZoU8';
    this.pageData = {
      title: 'Dispatch Management',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Dispatch',
          route: './dispatch'
        },
        {
          title: 'Dispatch Management'
        }
      ]
    };
    this.onResize();
    this.assembleInvoiceClick = this.assembleInvoiceClick.bind(this);
    this.openPackingSlipClick = this.openPackingSlipClick.bind(this);
    this.editAddressClick = this.editAddressClick.bind(this);
    this.dispatchClick = this.dispatchClick.bind(this);
    this.closeInvoiceClick = this.closeInvoiceClick.bind(this);
    this.payInvoiceClick = this.payInvoiceClick.bind(this);
    this.editInvoiceClick = this.editInvoiceClick.bind(this);
    this.printClick = this.printClick.bind(this);
    this.checkItemsClick = this.checkItemsClick.bind(this);
    this.lockClick = this.lockClick.bind(this);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.chartHeight = this.screenHeight * .47;
    this.chartHeight2 = this.screenHeight * .60;
    this.gridHeight = this.screenHeight * .25;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.user = this.userService.getUser();
    if (this.checkRole(42) === false) {
      this.router.navigateByUrl('/vertical/notallowed');
      return;
    }
    this.dataService.getDispatchGenerics(this.user.companyId).subscribe(data => {
      this.drivers = data.activeDrivers;
      this.shippingZones = data.shippingZones;
      this.carriers = data.carriers;
      this.packageTypes = data.packageTypes;
      this.dispatchStatuses = data.dispatchStatuses;
    });
    this.refreshLogs();
    this.refreshShippingLogs();
    this.refreshInvoices();
    this.startTimer();


  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 120;
        this.refreshInvoices();
      }
    }, 1000)
  }

  refreshLogs() {
    this.dataService.getDispatchLogs(this.user.companyId, 'A').subscribe(data => {
      this.dispatchLogs = data;
      this.dispatchList = [];
      data.forEach(item => {
        const dispatchItem = {
          id: item.id,
          dispatchId: item.dispatchId,
          LogText: item.dispatchId + '-' + item.driverName,
        };
        this.dispatchList.push(dispatchItem);
      });
      // this.dispatchList.push({ dispatchId: 0, LogText: 'Pickup' });
    });
  }

  refreshShippingLogs() {
    this.dataService.getShippingLogs(this.user.companyId).subscribe(data => {
      this.shippingLogs = data;
      this.shippingLogList = [];
      data.forEach(item => {
        const shippingLogItem = {
          id: item.id,
          text: item.id + '-' + item.carrierText
        };
        this.shippingLogList.push(shippingLogItem);
      });
      this.refreshInvoices();
    });
  }

  refreshInvoices() {
    this.dataService.getDispatchInvoices(this.user.companyId).subscribe(data => {
      this.invoices = data.invoices;
      this.markers = data.markers.filter(f => f.address !== null);
      this.invoiceCounts = data.invoiceCounts;
      this.pickupInvoices = this.invoices.filter(item => item.deliveryModeId === 1);
      this.deliveryInvoices = this.invoices.filter(item => item.deliveryModeId === 2);
      this.shippingInvoices = this.invoices.filter(item => item.deliveryModeId === 3);
      this.applyFilters(null);
      this.centerCoordinates = data.markers.filter(item => item.host === true)[0].location;
    });
  }

  applyFilters(zoneId) {
    if (zoneId === null) {
      this.filteredInvoices = this.deliveryInvoices;
      this.filteredMarkers = this.markers;
    } else {
      this.filteredInvoices = this.deliveryInvoices.filter(item => item.zoneId === zoneId);
      this.filteredMarkers = this.markers.filter(item => item.zoneId === zoneId);
    }
  }

  lockClick(e) {
    
    if (e.row.data.dispatchStatusId === "L"){
      this.messageDialog = this.dialog.open(MessageDialogComponent, {
        data: {
          message: 'Log is already Locked'
        },
        height: '200px',
        width: '600px',
        panelClass: 'my-dialog'
      });
      return;
    }

    this.confDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm',
        message: 'Do you want to Lock this Log?'
      }, height: '200px', width: '600px', panelClass: 'my-dialog'
    });

    const sub = this.confDialogRef.componentInstance.confirmEvent.subscribe((data) => {
      if (data === true) {
        
        this.dataService.lockDispatchLog(e.row.data.id).subscribe(
          (response) => {
            this.toastr.success('Locked Successfully!', 'Success', {
              timeOut: 3000,
            });
            this.refreshLogs();
            this.refreshInvoices();
          },
          (error) => {
            this.errorMessage = error.error;
            this.toastr.error(error, 'Log Update Failed');
            this.refreshLogs();
          }
        );
      }
    });

    this.confDialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });

  }

  dispatchClick(e) {

    if (e.row.data.driverId === 0) {
      this.messageDialog = this.dialog.open(MessageDialogComponent, {
        data: {
          message: 'Please Select Driver for Dispatch'
        },
        height: '200px',
        width: '600px',
        panelClass: 'my-dialog'
      });

      return;
    }

    this.isBusy = true;
    this.dataService.getAssemblyOpenItems(e.row.data.dispatchId,this.user.companyId).subscribe(invoices => {
      this.isBusy = false;
      if (invoices.length>0)  {
        this.pendingItemsdialogRef = this.dialog.open(PendingAssemblyDialogComponent, {
          data: {
            pendingItems: invoices
          },
          height: '50%',
          width: '40%'
        });
        return;
      }
      
      this.confDialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Confirm',
          message: 'Do you want to Dispatch this Log?'
        }, height: '200px', width: '600px', panelClass: 'my-dialog'
      });
  
      const sub = this.confDialogRef.componentInstance.confirmEvent.subscribe((data) => {
        if (data === true) {
          e.row.data.dispatchedById = this.user.id;
          e.row.data.updateUser = this.user.userId;
          this.dataService.DispatchDriver(e.row.data).subscribe(
            (response) => {
              this.toastr.success('Updated Successfully!', 'Success', {
                timeOut: 3000,
              });
              this.refreshLogs();
              this.refreshInvoices();
            },
            (error) => {
              this.errorMessage = error.error;
              this.toastr.error(error, 'Log Update Failed');
              this.refreshLogs();
            }
          );
        }
      });
  
      this.confDialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
      });


    });

  }

  confirmShipmentClick(e) {
  }

  dispatchLogDeleted(e) {
    this.dataService.DeleteDispatchLog(e.data.id).subscribe(
      (response) => {
        this.toastr.success('Deleted Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Delete Failed ');
        this.refreshLogs();
      }
    );
  }

  shippingLogAdded(e: { data: any }) {
    e.data.id = 0;
    e.data.companyId = this.user.companyId;
    e.data.shippedById = this.user.id;
    this.dataService.AddShippingLog(e.data).subscribe(
      (response) => {
        this.toastr.success('Shipping Log Added Successfully!', 'Success', {
          timeOut: 3000,
        });
        // Update Key of added entity from response object
        e.data.id = response;
        this.refreshShippingLogs();
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Customer Add Failed');
        this.refreshShippingLogs();
      }
    );
  }

  shippingLogUpdated(e) {
    this.dataService.UpdateShippingLog(e.data).subscribe(
      (response) => {
        this.toastr.success('Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
        this.refreshShippingLogs();
        this.refreshInvoices();
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error, 'Log Update Failed');
        this.refreshShippingLogs();
      }
    );
  }

  shippingLogDeleted(e) {
    this.dataService.DeleteShippingLog(e.data.id).subscribe(
      (response) => {
        this.toastr.success('Deleted Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Delete Failed ');
        this.refreshShippingLogs();
      }
    );
  }


  onDispatchToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'add',
          hint: 'New Log',
          onClick: this.addnewLog.bind(this)
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          hint: 'Refresh',
          onClick: this.refreshLogs.bind(this)
        }
      }
    );
  }

  onInvoicesToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          hint: 'Refresh',
          onClick: this.refreshInvoices.bind(this)
        }
      }
    );
  }




  onPickupToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          hint: 'Refresh',
          onClick: this.refreshInvoices.bind(this)
        }
      }
    );
  }

  onShippingLogToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          hint: 'Refresh',
          onClick: this.refreshShippingLogs.bind(this)
        }
      }
    );
  }

  printClick(e) {
  }

  checkItemsClick(e){
    this.dataService.getAssemblyOpenItems(e.row.data.dispatchId,this.user.companyId).subscribe(invoices => {
      this.pendingItemsdialogRef = this.dialog.open(PendingAssemblyDialogComponent, {
        data: {
          pendingItems: invoices
        },
        height: '60%',
        width: '50%'
      });
    });
  }

  checkRole(roleId: any) {
    return this.userService.checkRole(roleId);
  }

  addnewLog(e) {
    const params = {
      companyId: this.user.companyId,
      driverId: 0,
      dispatchedById: this.user.id,
      shippingZoneId: this.shippingZones[0].shippingZoneId
    };
    this.dataService.createNewDispatchLog(params).subscribe(data => {
      this.refreshLogs();
      this.toastr.success('Dispatch Log Created ', 'PaintCity Inc', { timeOut: 1000 });
    });
  }

  zoneChanged(e) {
    this.applyFilters(e.value);
  }

  // printDispatchLog(e) {
  //   this.dispatchLogdialogRef = this.dialog.open(DispatchLogReportComponent, {
  //     data: {
  //       log: e.row.data
  //     },
  //     height: '70%',
  //     width: '40%'
  //   });
  // }


  assembleInvoiceClick(e) {
    const selectedInvoice = e.row.data;
    this.dialogRef = this.dialog.open(InvoiceAssemblyDialogComponent, {
      data: {
        invoice: selectedInvoice
      },
      height: '70%',
      width: '40%'
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshInvoices();
      }
    });
  }

  openPackingSlipClick(e) {
    const selectedInvoice = e.row.data;
    this.packingDialogRef = this.dialog.open(PackingSlipDialogComponent, {
      data: {
        invoiceId: selectedInvoice.invoiceId
      },
      height: '95%',
      width: '50%',
      panelClass: 'my-dialog'
    });
  }



  editAddressClick(e) {
    const selectedInvoice = e.row.data;
    this.clientDialogRef = this.dialog.open(CommonEditorDialogComponent, {
      data: {
        editorType: 'clientAddress',
        client: selectedInvoice.client
      },
      height: (this.screenHeight * .40) + 'px',
      width: (this.screenWidth * .55) + 'px',
      panelClass: 'my-dialog'
    });

    this.clientDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshInvoices();
      }
    });

  }

  dispatchLogUpdated(e) {
    this.dataService.UpdateDispatchLog(e.data).subscribe(
      (response) => {
        this.toastr.success('Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
        this.refreshLogs();
        this.refreshInvoices();
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error, 'Log Update Failed');
        this.refreshLogs();
      }
    );
  }



  onShiipingLogToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          hint: 'Refresh',
          onClick: this.refreshShippingLogs.bind(this)
        }
      });
  }

  invoiceUpdated(e) {
    this.dataService.UpdateDispatchLogNumber(e.data).subscribe(
      (response) => {
        this.toastr.success('Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
        this.refreshLogs();
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error, 'Invoice Update Failed');
        this.refreshLogs();
      }
    );
  }

  shippingInvoiceUpdated(e) {
    this.dataService.UpdateShippingLogNumber(e.data).subscribe(
      (response) => {
        this.toastr.success('Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
        this.refreshLogs();
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error, 'Invoice Update Failed');
        this.refreshLogs();
      }
    );
  }

  closeInvoiceClick(e) {

    this.dataService.getInvoiceOpenItems(e.row.data.invoiceId).subscribe(invoices => {
      if (invoices.length>0)  {
        this.pendingItemsdialogRef = this.dialog.open(PendingAssemblyDialogComponent, {
          data: {
            pendingItems: invoices
          },
          height: '50%',
          width: '40%'
        });
      }
      else{
        
        // Close Invoice without Payment
        this.dataService.closeInvoice(e.row.data).subscribe(res => {
          this.toastr.success('Closed Without Payment', 'PaintCity Inc', { timeOut: 3000 });
          this.refreshInvoices();
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
    });


    
  }

  payInvoiceClick(e) {

    this.dataService.getInvoiceOpenItems(e.row.data.invoiceId).subscribe(invoices => {
      if (invoices.length>0)  {
        this.pendingItemsdialogRef = this.dialog.open(PendingAssemblyDialogComponent, {
          data: {
            pendingItems: invoices
          },
          height: '50%',
          width: '40%'
        });
        return;
      }
      else{
        this.clientPaymentDialogRef = this.dialog.open(PaymentDialogComponent, {
          data: {
            accountId: e.row.data.client.accountId,
            invoiceId: e.row.data.invoiceId
          },
          height: '40%',
          width: '50%',
          panelClass: 'my-dialog'
        });
    
        this.clientPaymentDialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.refreshInvoices();
          }
        });
        
      }
    });

  }

  editInvoiceClick(e) {
    this.invoicedialogRef = this.dialog.open(InvoiceDialogComponent, {
      data: {
        invoiceId: e.row.data.invoiceId
      },
      height: '99%',
      width: '95%'
    });

    this.invoicedialogRef.afterClosed().subscribe(result => {
      this.refreshInvoices();
    });

  }

  onCellPrepared(e) {
    if (e.rowType === 'data' && e.column.dataField === 'status') {
      e.cellElement.style.backgroundColor = e.data.status === 'In Assembly' ? '#e2942d' : '#186b23';
      e.cellElement.style.color = 'white';
      e.cellElement.style.fontWeight = 'bold';
    }

    if (e.rowType === 'data' && e.column.dataField === 'total' || e.column.dataField === 'dispatchId') {
      e.cellElement.style.fontWeight = 'bold';
    }
    if (e.rowType === 'data' && e.column.dataField === 'assemblyPercComplete') {
      e.cellElement.style.fontWeight = 'bold';
      e.cellElement.style.color = 'white';
      if (e.data.assemblyPercComplete >= 0 && e.data.assemblyPercComplete < .4) {
        e.cellElement.style.backgroundColor = 'maroon';
      } else if (e.data.assemblyPercComplete >= .50 && e.data.assemblyPercComplete < 1) {
        e.cellElement.style.backgroundColor = '#e2942d';
      } else {
        e.cellElement.style.backgroundColor = '#186b23';
      }
    }

  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
