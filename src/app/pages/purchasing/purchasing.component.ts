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
import { ProductEditorDialogComponent } from '../shared/product-editor-dialog/product-editor-dialog.component';
import { ProductSaleDialogComponent } from '../shared/product-sale-dialog/product-sale-dialog.component';

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
  poItems: any[];
  gridHeight: number = 900;
  selectedProduct: any;
  invoiceHistory: any;
  productCounts: any[];
  productdialogRef: MatDialogRef<ProductEditorDialogComponent>;
  auditDialogRef: MatDialogRef<ProductSaleDialogComponent>;
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
    
    this.editProductClick = this.editProductClick.bind(this);
    this.showAuditClick = this.showAuditClick.bind(this);
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
    this.user = this.userService.getUser();
    this.refreshPage();
  }

  refreshPage(){
    this.dataService.getOpenPurchaseOrders(this.user.companyId).subscribe(data => {
      this.purchaseOrders = data;
    });
  }

  poFocusChanged(e){
    
    this.dataService.getPurchaseOrderItems(e.row.data.poId,this.user.companyId).subscribe(data => {
      this.poItems = data;
      console.log(data);
    });
  }

  productFocusChanged(e) {
    this.selectedProduct = e.row.data;
    this.dataService.getProductHistory(this.selectedProduct.partLinkId, this.user.companyId).subscribe(data => {
      this.invoiceHistory = data.productHistory;
      this.productCounts = [];
      data.productCounts.forEach(item => {
        const dtl = {
          salesMonth: this.datepipe.transform(item.salesMonth, 'MMM-yy'),
          orderQty: item.orderQty
        };
        this.productCounts.push(dtl);
      });
    });
  }

  editProductClick(e) {
    this.productdialogRef = this.dialog.open(ProductEditorDialogComponent, {
      data: {
        partLinkId: e.row.data.partLinkId,
      },
      height: '95%',
      width: '70%',
      panelClass: 'my-dialog'
    });
  }

  showAuditClick(e){
    this.auditDialogRef = this.dialog.open(ProductSaleDialogComponent, {
      data: {
        partLinkId: e.row.data.id
      },
      height: '90%',
      width: '80%'
    });
  }


  checkRole(roleId: any) {
    return this.userService.checkRole(roleId);
  }
}
