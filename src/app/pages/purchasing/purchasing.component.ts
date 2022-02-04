import { AppState } from './../../interfaces/app-state';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { BasePageComponent } from '../base-page/base-page.component';
import { DataService } from '../services/data.service';
import { UserService } from '../services/user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { VendorDialogComponent } from '../shared/vendor-dialog/vendor-dialog.component';
import { PoviewerDialogComponent } from '../shared/poviewer-dialog/poviewer-dialog.component';

@Component({
  selector: 'app-purchasing',
  templateUrl: './purchasing.component.html',
  styleUrls: ['./purchasing.component.scss']
})
export class PurchasingComponent extends BasePageComponent implements OnInit, OnDestroy {
  errorMessage: any;
  screenHeight: number;
  screenWidth: number;
  user: any;
  purchaseOrders: any[];
  selectedVendor: any;
  vendors: any[];
  startDate: any;
  gridHeight: number;
  selectedPo: any;
  loadingVisible = false;
  confDialogRef: MatDialogRef<ConfirmDialogComponent>;
  vendorDialog: MatDialogRef<VendorDialogComponent>;
  poViewerDialog: MatDialogRef<PoviewerDialogComponent>;
  constructor(
    store: Store<AppState>,
    private toastr: ToastrService,
    private dataService: DataService,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router,
    public datepipe: DatePipe
  ) {
    super(store);
    this.onResize();
    this.pageData = {
      title: 'Back Office',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Purchasing',
          route: './purchasing'
        },
        {
          title: 'Purchase Management'
        }
      ]
    };
    this.editPoClick = this.editPoClick.bind(this);
    this.deletePoClick = this.deletePoClick.bind(this);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.gridHeight = this.screenHeight * .80;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.user = this.userService.getUser();
    if (this.checkRole(6) === false) {
      this.router.navigateByUrl('/vertical/notallowed');
      return;
    }
    this.dataService.getvendors(this.user.companyId).subscribe(data => {
      this.vendors = data;
      this.refreshPage();
    });
    this.startDate = new Date(new Date().getFullYear(), new Date().getMonth()-1,new Date().getDate());
    //this.editVendorsClick();
    //this.OpenPO(5);

  }

  onCellPrepared(e) {
    if (e.rowType === "data" && e.column.type === "buttons") {
      e.column.buttons.forEach((button: any) => 
      { 
        if (e.data.poStatusId > 1) {
          e.cellElement.style.visibility = "hidden";
        } 
      });
    }
  }

  
  OpenPO(poId: any){
    this.poViewerDialog = this.dialog.open(PoviewerDialogComponent, {
      data: {
        poId: poId, editable: true
      },
      height: '90%',
      width: '75%',
      panelClass: 'my-dialog'
    });
  }

  editPoClick(e){
    this.poViewerDialog = this.dialog.open(PoviewerDialogComponent, {
      data: {
        poId: e.row.data.poId, editable: e.row.data.poStatusId==1
      },
      height: '90%',
      width: '75%',
      panelClass: 'my-dialog'
    });
  }

  deletePoClick(e){
    if (e.row.data.poStatusId>1) {
      alert('Purchase Order cannot be deleted');
      return;
    }


    this.confDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm',
        message: 'Do you want to Delete the Purchase Order?'
      }, height: '200px', width: '600px', panelClass: 'my-dialog'
    });

    const sub = this.confDialogRef.componentInstance.confirmEvent.subscribe((data) => {
      if (data === true) {
        this.dataService.DeletePo(e.row.data.poId).subscribe (
          (response): void => {
            this.toastr.success('Purchase Order Deleted Successfully!', 'Success', {
              timeOut: 3000,
            });
            this.refreshPage();
          },
          (error) => {
            this.errorMessage = error.error;
            this.toastr.error('Purchase Order Delete Failed ');
            this.refreshPage();
          }
        );
      }
    });

    this.confDialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });

  }

  sendPoClick(e){

  }

  refreshPage(){
    this.loadingVisible= true;
    this.dataService.getOpenPurchaseOrders(this.user.companyId).subscribe(data => {
      this.purchaseOrders = data;
      this.loadingVisible= false;
    });
  }

  // refreshPoItems(){
  //   this.loadingVisible= true;
  //   this.dataService.getPurchaseOrderItems(this.selectedPo.poId,this.user.companyId,this.activeProducts).subscribe(data => {
  //     this.poItems = data;
  //     this.loadingVisible= false;
  //   });
  // }

  poFocusChanged(e){
    this.selectedPo = e.row.data;
  }

  

  addPo(){
  }

  addAutoPo(){
    const poModel = {
      companyId: this.user.companyId,
      startDate: this.startDate
    }
    this.loadingVisible= true;
    this.dataService.CreateAutoPo(poModel).subscribe(data => {
      this.toastr.success('Success', 'PaintCity Inc', { timeOut: 1000 });
      this.errorMessage = null;
      this.loadingVisible= false;
      this.refreshPage();
    },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Failed');
      });
  }

  editVendorsClick(){
    this.vendorDialog = this.dialog.open(VendorDialogComponent, {
      height: '50%',
      width: '70%',
      panelClass: 'my-dialog'
    });
  }

  checkRole(roleId: any) {
    return this.userService.checkRole(roleId);
  }
}
