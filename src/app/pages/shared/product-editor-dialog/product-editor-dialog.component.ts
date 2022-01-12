import { FormatterService } from './../../services/formatter.service';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-product-editor-dialog',
  templateUrl: './product-editor-dialog.component.html',
  styleUrls: ['./product-editor-dialog.component.scss']
})


export class ProductEditorDialogComponent implements OnInit {
  selectedProduct: any;
  user: any;
  categories: any = [];
  productLines: any[];
  minRetailSell: 0;
  maxRetailSell: 0;
  minWholeSell: 0;
  maxWholeSell: 0;
  cost: 0;
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    partLinkId: any,
  },
    private mdDialogRef: MatDialogRef<ProductEditorDialogComponent>,
    private dataService: DataService,
    private toastr: ToastrService,
    private formatService: FormatterService,
    private userService: UserService,
    private dialog: MatDialog) {
    mdDialogRef.disableClose = true;
  }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.dataService.GetProductStatics().subscribe(data => {
      this.categories = data.categories;
      this.productLines = data.productLines;
    });
    this.dataService.getProduct(this.data.partLinkId, this.user.companyId).subscribe(data => {
      this.selectedProduct = data;
    });
  }

  checkRole(roleId: any) {
    return this.userService.checkRole(roleId);
  }

  form_fieldDataChanged(e) {
    this.selectedProduct = e.component.option('formData');
  }

  calcSellRange() {
    this.minRetailSell = this.selectedProduct.minRetailSell > 0
      ? this.formatService.formatToDecimal(this.selectedProduct.cost
        + this.selectedProduct.cost * this.selectedProduct.minRetailSell / 100)
      : this.formatService.formatToDecimal(this.selectedProduct.cost);
    this.maxRetailSell = this.selectedProduct.maxRetailSell < 500
      ? this.formatService.formatToDecimal(this.selectedProduct.cost
        + this.selectedProduct.cost * this.selectedProduct.maxRetailSell / 100)
      : this.formatService.formatToDecimal(this.selectedProduct.cost * 5);
    this.minWholeSell = this.selectedProduct.minWholeSell > 0
      ? this.formatService.formatToDecimal(this.selectedProduct.cost
        + this.selectedProduct.cost * this.selectedProduct.minWholeSell / 100)
      : this.formatService.formatToDecimal(this.selectedProduct.cost);
    this.maxWholeSell = this.selectedProduct.maxWholeSell < 500
      ? this.formatService.formatToDecimal(this.selectedProduct.cost
        + this.selectedProduct.cost * this.selectedProduct.maxWholeSell / 100)
      : this.formatService.formatToDecimal(this.selectedProduct.cost * 5);
    this.cost = this.selectedProduct.cost;
  }

  calcSale() {
    this.selectedProduct.sell = this.selectedProduct.fixedSell;
    if (this.selectedProduct.isOnSale && this.selectedProduct.salePrice >= 0) {
      this.selectedProduct.sell = +this.selectedProduct.salePrice;
    }
    if (this.selectedProduct.sellIndex != 0 && this.selectedProduct.cost != 0) {
      this.selectedProduct.sell = Number(this.formatService.formatToDecimal(this.selectedProduct.cost + this.selectedProduct.cost * this.selectedProduct.sellIndex / 100));
    } else {
      this.selectedProduct.sell = Number(this.selectedProduct.fixedSell);
    }
    if (this.selectedProduct.jobberIndex != 0 && this.selectedProduct.cost != 0) {
      this.selectedProduct.jobberSell = Number(this.formatService.formatToDecimal(this.selectedProduct.cost + this.selectedProduct.cost * this.selectedProduct.jobberIndex / 100));
    } else {
      this.selectedProduct.jobberSell = Number(this.selectedProduct.fixedJobber);
    }
    if (this.selectedProduct.onlineIndex != 0 && this.selectedProduct.cost != 0) {
      this.selectedProduct.onlineSell = Number(this.formatService.formatToDecimal(this.selectedProduct.cost + this.selectedProduct.cost * this.selectedProduct.onlineIndex / 100));
    } else {
      this.selectedProduct.onlineSell = Number(this.selectedProduct.fixedSell);
    }
    //return Number(product.sell);
  }

  Saveclicked(e) {
    this.selectedProduct.sell = Number(this.selectedProduct.sell);
    //this.selectedProduct.productOverview = this.productOverview;
    this.selectedProduct.lastUpdateUserId = this.user.id;
    this.selectedProduct.lastUpdateUser = this.user.userId;
    this.dataService.UpdateProduct(this.selectedProduct).subscribe(
      (response) => {
        this.toastr.success('Product Updated Successfully!', 'Success', {
          timeOut: 2000,
        });
        this.mdDialogRef.close(true);
      },
      (error) => {
        //  this.errorMessage = error.error;
        this.toastr.error('Product Update Failed');
      }
    );
  }

  CloseClick() {
    this.mdDialogRef.close(true);
  }

}
