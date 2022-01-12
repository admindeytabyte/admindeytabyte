import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-product-batch-dialog',
  templateUrl: './product-batch-dialog.component.html',
  styleUrls: ['./product-batch-dialog.component.scss']
})
export class ProductBatchDialogComponent implements OnInit {
  @Output() addProductsEvent: EventEmitter<any[]> = new EventEmitter<any[]>();
  skus: string;
  productsList: any[];
  loadingVisible: boolean;
  user: any;
  numYears = 2;
  filteredClientHistory: any[];
  clientHistory: any[];
  //selectedProduct: any;
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    invoiceId: number,
    accountId: number,
    parentType: string,
    isJobber: boolean,
    clientName: string
  },
    private mdDialogRef: MatDialogRef<ProductBatchDialogComponent>,
    private dataService: DataService,
    private toastr: ToastrService,
    private userService: UserService) { }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.GetClientHistory();
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          hint: 'Refresh',
          onClick: this.GetClientHistory.bind(this)
        }
      },
      {
        location: 'after',
        widget: 'dxNumberBox',
        options: {
          width: 100,
          min: '1',
          max: '5',
          showSpinButtons: true,
          value: '2',
          onValueChanged: this.numYears_valueChanged.bind(this)
        }
      })
  }

  numYears_valueChanged(e) {
    this.numYears = e.value;
    this.GetClientHistory();
  }

  GetClientHistory() {
    this.dataService.getClientHistory(this.data.accountId, this.data.invoiceId, this.numYears).subscribe(data => {
      this.clientHistory = data;
      this.filteredClientHistory = data;
    });
  }

  productChanged(e) {
    //this.selectedProduct = e.row.data;
    this.filteredClientHistory = this.clientHistory.filter(f => f.partLinkId === e.row.data.id);
  }

  onResultsGridToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          text: 'Preview',
          hint: 'Preview Products',
          onClick: this.previewProducts.bind(this)
        }
      },
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          text: 'Add to Invoice',
          hint: 'Add Products to Invoice',
          onClick: this.importProducts.bind(this)
        }
      }
    );
  }

  onCellPrepared(e) {
    if (e.rowType === 'data' && e.column.dataField === 'inStockQty') {
      e.cellElement.style.color = e.data.inStockQty >= 0 ? 'black' : 'red';
    }

    if (e.rowType === 'data' && e.column.dataField === 'onOrderQty') {
      e.cellElement.style.color = e.data.onOrderQty >= 0 ? 'black' : 'red';
    }
  }

  checkRole(roleId: any) {
    return this.userService.checkRole(roleId);
  }

  previewProducts() {

    if (this.skus.length === 0) {
      return;
    }

    this.loadingVisible = true;
    const productParams = {
      accountId: this.data.accountId,
      companyId: this.user.companyId,
      skuList: this.skus
    }

    let indexId = 0;
    this.productsList = [];
    this.dataService.getProductsforBatch(productParams).subscribe(data => {
      this.loadingVisible = false;
      // data.forEach(p => {
      //   p.indexId = indexId++;
      //   this.productsList.push(p);
      // });
      this.productsList = data;
    });
  }

  importProducts() {
    if (this.productsList.length === 0) {
      return;
    }
    this.addProductsEvent.emit(this.productsList);
    this.mdDialogRef.close(true);
  }

  CloseClick() {
    this.mdDialogRef.close(true);
  }

}
