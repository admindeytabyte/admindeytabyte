import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ProductEditorDialogComponent } from '../product-editor-dialog/product-editor-dialog.component';
import { ProductSaleDialogComponent } from '../product-sale-dialog/product-sale-dialog.component';

@Component({
  selector: 'app-poviewer-dialog',
  templateUrl: './poviewer-dialog.component.html',
  styleUrls: ['./poviewer-dialog.component.scss']
})
export class PoviewerDialogComponent implements OnInit {
  purchaseOrder: any;
  loadingVisible: boolean;
  user: any;
  poItems: any[];
  activeProducts = true;
  showImages = false;
  isEditable: boolean;
  selectedProduct: any;
  vendorCosts: any;
  invoiceHistory: any;
  productCounts: any[];
  productdialogRef: MatDialogRef<ProductEditorDialogComponent>;
  auditDialogRef: MatDialogRef<ProductSaleDialogComponent>;
  confDialogRef: MatDialogRef<ConfirmDialogComponent>;
  errorMessage: any;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {poId: any, editable: any},
    private mdDialogRef: MatDialogRef<PoviewerDialogComponent>,
    private dataService: DataService,
    private toastr: ToastrService,
    private userService: UserService,
    public datepipe: DatePipe,
    private dialog: MatDialog
  ) {
    //mdDialogRef.disableClose = true;
    this.isEditable = this.data.editable;
  }


  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.refreshPoItems();
  }

  refreshPoItems(){
    this.loadingVisible= true;
    this.dataService.getPurchaseOrderItems(this.data.poId,this.user.companyId,this.activeProducts).subscribe(data => {
      this.poItems = data;
      this.loadingVisible= false;
    });
  }

  onItemsCellPrepared(e) {
    if (e.rowType === "data" && (e.column.dataField === "orderQty" || e.column.dataField === "orderPrice" 
          || e.column.dataField === "orderAmount")) {
      e.cellElement.style.color = e.data.orderQty > 0 ? "black" : "red";
    }
    
    if (e.rowType === "data" && e.column.type === "buttons") {
      e.column.buttons.forEach((button: any) => 
      { 
        if (button.hint=="Delete" && e.row.data.ordered==true) {
          e.cellElement.style.visibility = "hidden";
        } 
      });
    }
  }

  onItemsGridToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxCheckBox',
         options: {
          width: 150,
          value: this.activeProducts,
          onValueChanged: this.SetActiveMode.bind(this),
          hint: 'Show Only Qty>0',
          text: 'Active Products'
        },    
      },
      {
        location: 'after',
        widget: 'dxCheckBox',
         options: {
          width: 150,
          value: this.showImages,
          onValueChanged: this.SetImageMode.bind(this),
          hint: 'Show Images',
          text: 'Show Images'
        },    
      }
    );
  }

  SetActiveMode(e){
    this.activeProducts = e.value;
    this.refreshPoItems();
  }

  SetImageMode(e){
    this.showImages = e.value;
    //this.refreshPoItems();
  }

  PoIsOpen(){
    //return this.selectedPo.poStatusId > 1 ? true : false;
    return true;
}


  productFocusChanged(e) {
    this.selectedProduct = e.row.data;
    this.vendorCosts = this.selectedProduct.vendorCosts;
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

  deleteItemClick(e){
    this.confDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm',
        message: 'Do you want to Delete the Product from the Purchase Order?'
      }, height: '200px', width: '600px', panelClass: 'my-dialog'
    });

    const sub = this.confDialogRef.componentInstance.confirmEvent.subscribe((data) => {
      if (data === true) {
        const poModel = {
          poId: e.row.data.poId,
          poDtlId: e.row.data.poDtlId
        }
        this.dataService.DeletePoItem(poModel).subscribe (
          (response): void => {
            this.toastr.success('Product Deleted Successfully!', 'Success', {
              timeOut: 3000,
            });
            this.refreshPoItems();
          },
          (error) => {
            this.errorMessage = error.error;
            this.toastr.error('Product Delete Failed ');
            this.refreshPoItems();
          }
        );
      }
    });

    this.confDialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  checkRole(roleId: any) {
    return this.userService.checkRole(roleId);
  }

}
