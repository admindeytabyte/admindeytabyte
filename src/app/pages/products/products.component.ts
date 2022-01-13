import { FormatterService } from './../services/formatter.service';
import { AppState } from './../../interfaces/app-state';
import { Component, OnInit, OnDestroy, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { BasePageComponent } from '../base-page/base-page.component';
import { DataService } from '../services/data.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ProductEditorComponent } from '../shared/product-editor/product-editor.component';
import { ProductAddDialogComponent } from '../shared/product-add-dialog/product-add-dialog.component';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ProductSaleDialogComponent } from '../shared/product-sale-dialog/product-sale-dialog.component';
import { ProductMergeDialogComponent } from '../shared/product-merge-dialog/product-merge-dialog.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

export class ProductsComponent extends BasePageComponent implements OnInit, OnDestroy {
  errorMessage: any;
  loadingVisible = false;
  // Search inputs
  line: string;
  sku: string;
  description: string;
  combination: string;
  categories: any[] = [];
  category: any;
  categoryId: any;
  productsList: any[];
  formulaeFields: string[];
  indexFields: string[];
  primaryField: any;
  secondaryField: any;
  indexField: any;
  valueField = 0;
  indexValueField = 0;
  soldMonthQty = 0;
  screenHeight: number;
  screenWidth: number;
  selectedAccount: any = null;
  productGridHeight = 0;
  productOverview: string;
  selectedProduct: any;
  active = true;
  showImages = true;
  inStock = false;
  focusedRowKey: 0;
  productLines: any[] = [];
  productCounts: any[] = [];
  invoiceHistory: any[];
  minRetailSell: 0;
  maxRetailSell: 0;
  minWholeSell: 0;
  maxWholeSell: 0;
  cost: 0;
  buttonOptions: any = {
    text: 'Save',
    type: 'success',
    useSubmitBehavior: true
  }

  dialogRef: MatDialogRef<ProductEditorComponent>;
  dialogNewProductRef: MatDialogRef<ProductAddDialogComponent>;
  dialogProductMerge: MatDialogRef<ProductMergeDialogComponent>;
  auditDialogRef: MatDialogRef<ProductSaleDialogComponent>;
  user: any;

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  constructor(
    store: Store<AppState>,
    private toastr: ToastrService,
    private dataService: DataService,
    private formatService: FormatterService,
    private cdRef: ChangeDetectorRef,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router,
    public datepipe: DatePipe
  ) {
    super(store);

    this.pageData = {
      title: 'Products Management',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Products',
          route: './products'
        },
        {
          title: 'Manage'
        }
      ]
    };
    this.refreshProducts = this.refreshProducts.bind(this);
    this.calcSale = this.calcSale.bind(this);
    this.showAuditClick = this.showAuditClick.bind(this);
    this.formulaeFields = ['Sell', 'Jobber', 'FixedCost'];
    this.indexFields = ['Sell', 'Jobber', 'Online'];
    this.onResize();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.user = this.userService.getUser();
    this.RefreshStatics();
    if (this.checkRole(41) === false) {
      this.router.navigateByUrl('/vertical/notallowed');
      return;
    }
    //this.sku = 'ec21';
    //this.combination = '3p11';
    //this.refreshProducts();
    //this.mergeProducts();
  }

  checkRole(roleId: any) {
    return this.userService.checkRole(roleId);
  }

  @HostListener('keydown.esc', ['$event'])
  public onEsc() {
    this.reset();
  }

  reset() {
    this.line = '';
    this.sku = '';
    this.description = '';
    this.combination = '';
    this.category = null;
    this.selectedProduct = null;
    this.RefreshStatics();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.productGridHeight = this.screenHeight * .75;
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 120,
          text: 'Categories',
          onClick: this.editCategories.bind(this)
        }
      },
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 150,
          text: 'Product Lines',
          onClick: this.editProductLines.bind(this)
        }
      },
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 120,
          text: 'Slabs',
          onClick: this.editSlabs.bind(this)
        }
      },
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 120,
          text: 'Related',
          onClick: this.editRelated.bind(this)
        }
      },
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 120,
          text: 'Images',
          onClick: this.editImages.bind(this)
        }
      },
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 120,
          text: 'Merge',
          onClick: this.mergeProducts.bind(this)
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'add',
          hint: 'Add New Product',
          onClick: this.showProductAdd.bind(this)
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          hint: 'Refresh Attributes',
          onClick: this.RefreshStatics.bind(this)
        }
      }
    );
  }

  RefreshStatics() {
    this.dataService.GetProductStatics().subscribe(data => {
      this.categories = data.categories;
      this.productLines = data.productLines;
    });
  }

  products_tabClick(e) {
  }

  productFocusChanged(e) {
    this.selectedProduct = e.row.data;
    this.selectedProduct.sell = 0;
    this.productOverview = e.row.data.productOverview;
    this.calcSellRange();
    this.dataService.getProductHistory(this.selectedProduct.id, this.user.companyId).subscribe(data => {
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

  applyFormulea() {

    if (this.primaryField === null) {
      this.errorMessage = 'Please select Primary Field';
      return;
    }

    if (this.secondaryField === 0) {
      this.errorMessage = 'Please select Secondary Field';
      return;
    }

    if (this.productsList.length === 0) {
      this.errorMessage = 'No Products Selected';
      return;
    }


    const updateModel = {
      primaryField: this.primaryField,
      secondaryField: this.secondaryField,
      valueField: this.valueField,
      products: this.productsList,
      companyId: this.user.companyId
    }

    // Send Updates
    this.dataService.updateProductsBatch(updateModel).subscribe(data => {
      this.toastr.success('Products Updated', 'PaintCity Inc', { timeOut: 3000 });
      this.refreshProducts();
    },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Update Failed');
      });
  }


  applyIndexFormulea() {

    if (this.productsList.length === 0) {
      this.errorMessage = 'No Products Selected';
      return;
    }


    if (this.indexField === null) {
      this.errorMessage = 'Please select Index Field';
      return;
    }


    const updateModel = {
      indexField: this.indexField,
      indexValue: this.indexValueField,
      companyId: this.user.companyId,
      products: this.productsList,
    }

    // Send Updates
    this.dataService.updateProductsIndex(updateModel).subscribe(data => {
      this.toastr.success('Products Updated', 'PaintCity Inc', { timeOut: 3000 });
      this.refreshProducts();
    },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Update Failed');
      });
  }

  showProductAdd() {
    this.dialogNewProductRef = this.dialog.open(ProductAddDialogComponent,
      {
        height: (this.screenHeight * .40) + 'px',
        width: (this.screenWidth * .30) + 'px',
        panelClass: 'my-dialog'
      });

    const sub = this.dialogNewProductRef.componentInstance.newProductEvent.subscribe((data) => {
      this.sku = data.sku;
      this.refreshProducts();
    });

    this.dialogNewProductRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  editSlabs() {
    if (this.selectedProduct === undefined || this.selectedProduct === null) {
      alert('Please Select a Product');
      return;
    }
    this.dialogRef = this.dialog.open(ProductEditorComponent, {
      data: {
        editorType: 'productSlabs',
        product: this.selectedProduct
      },
      height: (this.screenHeight * .40) + 'px',
      width: (this.screenWidth * .30) + 'px',
      panelClass: 'my-dialog'
    });
  }

  editRelated() {
    if (this.selectedProduct === undefined || this.selectedProduct === null) {
      alert('Please Select a Product');
      return;
    }
    this.dialogRef = this.dialog.open(ProductEditorComponent, {
      data: {
        editorType: 'productRelated',
        product: this.selectedProduct
      },
      height: (this.screenHeight * .60) + 'px',
      width: (this.screenWidth * .50) + 'px',
      panelClass: 'my-dialog'
    });
  }

  editCategories() {
    this.dialogRef = this.dialog.open(ProductEditorComponent, {
      data: {
        editorType: 'categories'
      },
      height: (this.screenHeight * .60) + 'px',
      width: (this.screenWidth * .50) + 'px',
      panelClass: 'my-dialog'
    });

    this.dialogRef.afterClosed().subscribe(() => {
      this.RefreshStatics();
    });

  }

  editProductLines() {
    this.dialogRef = this.dialog.open(ProductEditorComponent, {
      data: {
        editorType: 'productLines'
      },
      height: (this.screenHeight * .60) + 'px',
      width: (this.screenWidth * .40) + 'px',
      panelClass: 'my-dialog'
    });

    this.dialogRef.afterClosed().subscribe(() => {
      this.RefreshStatics();
    });

  }

  editImages() {
    if (this.selectedProduct === undefined || this.selectedProduct === null) {
      alert('Please Select a Product');
      return;
    }
    this.dialogRef = this.dialog.open(ProductEditorComponent, {
      data: {
        editorType: 'productImages',
        product: this.selectedProduct
      },
      height: (this.screenHeight * .70) + 'px',
      width: (this.screenWidth * .60) + 'px',
      panelClass: 'my-dialog'
    });
  }

  mergeProducts() {
    this.dialogProductMerge = this.dialog.open(ProductMergeDialogComponent, {
      disableClose: true,
      height: (this.screenHeight * .85) + 'px',
      width: (this.screenWidth * .85) + 'px',
      panelClass: 'my-dialog'
    });
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

  onCellPrepared(e) {
    if (e.rowType === 'data' && e.column.dataField === 'inStockQty') {
      e.cellElement.style.color = e.data.inStockQty >= 0 ? 'black' : 'red';
    }

    if (e.rowType === 'data' && e.column.dataField === 'onOrderQty') {
      e.cellElement.style.color = e.data.onOrderQty >= 0 ? 'black' : 'red';
    }
  }

  searchProducts(e) {
    if (e === undefined) {
      return;
    }
    if (e.value === undefined) {
      this.productsList = [];
      return;
    }
    this.refreshProducts();
  }

  refreshProducts() {
    this.selectedProduct = null;
    this.loadingVisible = true;
    const productParams = {
      categoryId: this.category !== undefined ? this.category !== null ? this.category.categoryId : 0 : 0,
      line: this.line !== undefined ? this.line : '',
      sku: this.sku !== undefined ? this.sku : '',
      description: this.description !== undefined ? this.description : '',
      combination: this.combination !== undefined ? this.combination : '',
      accountId: 0,
      invoiceId: 0,
      active: this.active,
      inStock: this.inStock,
      companyId: this.user.companyId,
      soldMonths: this.soldMonthQty
    }

    this.dataService.getProductsforInvoice(productParams).subscribe(data => {
      this.loadingVisible = false;
      this.focusedRowKey = data.length > 0 ?
        Math.min.apply(Math, data.map(function (o) { return o.id; })) : 0;
      this.productsList = data;
    });
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


  form_fieldDataChanged(e) {
    this.selectedProduct = e.component.option('formData');
  }

  Saveclicked(e) {
    this.selectedProduct.sell = Number(this.selectedProduct.sell);
    this.selectedProduct.productOverview = this.productOverview;
    this.selectedProduct.lastUpdateUserId = this.user.id;
    this.selectedProduct.lastUpdateUser = this.user.userId;
    this.dataService.UpdateProduct(this.selectedProduct).subscribe(
      (response) => {
        this.toastr.success('Product Updated Successfully!', 'Success', {
          timeOut: 2000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Product Update Failed');
      }
    );
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

  // showAuditClick(e){

  // }

  productUpdated(e: any) {
    e.data.sell = Number(e.data.sell);
    e.data.lastUpdateUserId = this.user.id;
    e.data.lastUpdateUser = this.user.userId;
    this.dataService.UpdateProduct(e.data).subscribe(
      (response) => {
        this.toastr.success('Product Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Product Update Failed');
        this.searchProducts(this.refreshProducts());
      }
    );
  }

  productDeleted(e: any) {
    this.dataService.DeleteProduct(e.data.id).subscribe(
      (response) => {
        this.toastr.success('Product Deleted Successfully!', 'Success', {
          timeOut: 3000,
        });
        // this.searchProducts(this.refreshProducts());
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Product Delete Failed ');
        this.searchProducts(this.refreshProducts());
      }
    );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
