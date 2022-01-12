import { Component, OnInit, Output, Inject, HostListener, EventEmitter, OnDestroy,ViewChild  } from '@angular/core';
import { ProductEditorDialogComponent } from './../product-editor-dialog/product-editor-dialog.component';
import { UserService } from './../../services/user.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DataService } from '../../services/data.service';
import { ClientDiscountsDialogComponent } from '../client-discounts-dialog/client-discounts-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { DxDataGridComponent, DxTextBoxComponent } from 'devextreme-angular';
import { ProductEditorComponent } from '../product-editor/product-editor.component';
import { ProductAddDialogComponent } from '../product-add-dialog/product-add-dialog.component';


@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})

export class ProductDialogComponent implements OnInit {
  @ViewChild("lineTextBox", { static: false }) lineTextBox: DxTextBoxComponent;
  @ViewChild("skuTextBox", { static: false }) skuTextBox: DxTextBoxComponent;
  @ViewChild("descTextBox", { static: false }) descTextBox: DxTextBoxComponent;
  @ViewChild("combTextBox", { static: false }) combTextBox: DxTextBoxComponent;
  @ViewChild("productsGrid", { static: false }) productsGrid: DxDataGridComponent;
  @Output() selectProductEvent: EventEmitter<any> = new EventEmitter<any>();
  categories: any[];
  // Search inputs
  line: string;
  hideCost = true;
  ctr = 0;
  isLoading = false;
  sku: string;
  description: string;
  numYears = 1;
  combination: string;
  active = true;
  inStock = false;
  category: any;
  categoryId: any;
  productParams: any;
  fromInvoice = false;
  fromProducts = false;
  productsList: any[];
  selectedProducts: any[];
  clientHistory: any[];
  filteredClientHistory: any[];
  loadingVisible: boolean;
  productGridHeight = 500;
  selectedProduct: any;
  requiredProducts: any[];
  productCount: any;
  discPercent = 0;
  showImages = false;
  clientMatrixDialogRef: MatDialogRef<ClientDiscountsDialogComponent>;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  dialogNewProductRef: MatDialogRef<ProductAddDialogComponent>;
  productEditordialogRef: MatDialogRef<ProductEditorComponent>;
  productdialogRef: MatDialogRef<ProductEditorDialogComponent>;
  user: any;
  errorMessage: any;
  clientType: any;
  title: any;
  autoSelectQty = false;
  quantityBreaks: any[];
  focusedRowKey = 0;
  screenHeight: number;
  screenWidth: number;
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    invoiceId: number,
    accountId: number,
    parentType: string,
    isJobber: boolean,
    clientName: string
  }, private mdDialogRef: MatDialogRef<ProductDialogComponent>,
    private dataService: DataService,
    private userService: UserService,
    private toastr: ToastrService,
    private dialog: MatDialog) {
    this.selectProductClick = this.selectProductClick.bind(this);
    this.editProductClick = this.editProductClick.bind(this);
    this.selectProductfromHistoryClick = this.selectProductfromHistoryClick.bind(this);
    this.showQuantityBreaksClick = this.showQuantityBreaksClick.bind(this);
    this.refreshProducts = this.refreshProducts.bind(this);
    this.deleteItemClick = this.deleteItemClick.bind(this);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.productGridHeight = this.screenHeight * .50;
    console.log('Products-' +this.screenHeight + ',' + this.productGridHeight);
  }

  @HostListener('window:keydown.Control.r', ['$event'])
  onKeyDownControlR(e) {
    e.preventDefault();
    this.reset();
  }


  @HostListener('window:keydown.Control.a', ['$event'])
  onKeyDownControlA(e) {
    e.preventDefault();
    this.productsGrid.instance.editCell(0,'orderQty');
  }

  @HostListener('window:keydown.Control.l', ['$event'])
  onKeyDownControlL(e) {
    e.preventDefault();
    this.lineTextBox.instance.focus();
  }

  @HostListener('window:keydown.Control.s', ['$event'])
  onKeyDownControlS(e) {
    e.preventDefault();
    this.skuTextBox.instance.focus();
  }

  @HostListener('window:keydown.Control.d', ['$event'])
  onKeyDownControlD(e) {
    e.preventDefault();
    this.descTextBox.instance.focus();
  }

  @HostListener('window:keydown.Control.c', ['$event'])
  onKeyDownControlC(e) {
    e.preventDefault();
    this.combTextBox.instance.focus();
  }

  @HostListener('window:keydown.Control.m', ['$event'])
  onKeyDownControlM(e) {
    e.preventDefault();
    this.focusedRowKey = this.focusedRowKey + 1;
    this.productsGrid.instance.editCell(this.focusedRowKey,'orderQty');
  }

  @HostListener('window:keydown.Shift.m', ['$event'])
  onKeyDownShiftM(e) {
    e.preventDefault();
    this.focusedRowKey = this.focusedRowKey - 1;
    this.productsGrid.instance.editCell(this.focusedRowKey,'orderQty');
  }

  @HostListener('window:keydown.Escape', ['$event'])
  onKeyDownEscape(e) {
    e.preventDefault();
    this.close(false);
  }

  ngOnInit(): void {
    //this.mdDialogRef.updateSize("721px", "1400px");
    //this.onResize();
    this.user = this.userService.getUser();
    this.clientType = this.data.isJobber === true ? 'Jobber' : 'Retail';
    this.title = 'Product Search';
    this.dataService.getCategories().subscribe(data => {
    this.categories = data;
    this.selectedProducts = [];
    //this.line = '3m';
    //this.sku = 'EC21';
    //this.combination = '3p22';
    //this.refreshProducts();
    this.productCount = '0 Products Found';
    });
    switch (this.data.parentType) {
      case 'products': {
        this.fromProducts = true;
        break;
      }
      case 'invoice': {
        this.fromInvoice = true;
        this.title = 'Product Search for ' + this.data.clientName + '(' + this.clientType + ')';
        this.GetClientHistory();
        break;
      }
      default: {
        break;
      }
    }

    
  }

  reset() {
    this.line = '';
    this.sku = '';
    this.description = '';
    this.combination = '';
    this.category = null;
    this.selectedProduct = null;
    //this.filteredClientHistory = this.clientHistory;
    this.GetClientHistory();
  }

  

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift({
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

  onKeyDown(e) {
    if (e.event.key === "Escape") {
      this.close(false);
    }
  }

  onResultsGridToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxCheckBox',
        options: {
          text: 'Minimized',
          hint: 'Minimized',
          visible: this.checkRole(12),
          value: this.hideCost,
          width: 150,
          class: 'gridPanelControl',
          onValueChanged: this.applyMinimizedFilter.bind(this)
        }
      },
      {
        location: 'after',
        widget: 'dxCheckBox',
        options: {
          text: 'Auto Select',
          hint: 'Auto Select',
          value: this.autoSelectQty,
          width: 150,
          class: 'gridPanelControl',
          onValueChanged: this.applyAutoSelect.bind(this)
        }
      },
      {
        location: 'before',
        template: 'productCount',
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'formula',
          hint: 'Client Discount Matrix',
          onClick: this.ShowDiscounts.bind(this)
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
      }
    );
  }

  applyMinimizedFilter(e) {
    this.hideCost = e.value;
  }

  applyAutoSelect(e) {
    this.autoSelectQty = e.value;
  }

  checkRole(roleId: any) {
    return this.userService.checkRole(roleId);
  }

  // applyDiscountsonSelected() {
  //   this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
  //     data: {
  //       title: 'Discount Confirmation', message: 'Do you want to apply ' + this.discPercent + '%'
  //         + ' discount on the ' + this.productsList.length + ' Products'
  //     },
  //     height: '150px',
  //     width: '600px'
  //   });

  //   const sub = this.confirmDialogRef.componentInstance.confirmEvent.subscribe((result) => {
  //     if (result === true) {
  //       const updateModel = {
  //         accountId: this.data.accountId,
  //         percDiscount: this.discPercent,
  //         products: this.productsList,
  //         discountFieldId: this.data.isJobber ? 2 : 1,
  //         createdByUserId: this.user.id,
  //         modifiedUserId: this.user.userId
  //       }

  //       // Send Updates
  //       this.dataService.updateDiscounts(updateModel).subscribe(data => {
  //         this.toastr.success('Discounts Updated', 'PaintCity Inc', { timeOut: 3000 });
  //         this.refreshProducts();
  //       },
  //         (error) => {
  //           this.errorMessage = error.error;
  //           this.toastr.error('Update Failed');
  //         });
  //     }
  //   });

  //   this.confirmDialogRef.afterClosed().subscribe(() => {
  //     sub.unsubscribe();
  //   });
  // }

  applyPercDiscount(e) {
    const updateModel = {
      accountId: this.data.accountId,
      percDiscount: e.value,
      customSell: e.value,
      discountType: '%',
      products: this.productsList,
      discountFieldId: this.data.isJobber ? 2 : 1,
      createdByUserId: this.user.id,
      modifiedUserId: this.user.userId
    }

    // Send Updates
    this.dataService.updateDiscounts(updateModel).subscribe(data => {
      this.toastr.success('Discounts Updated', 'PaintCity Inc', { timeOut: 3000 });
      this.refreshProducts();
    },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Update Failed');
      });
  }

  applyDollarDiscount(e) {
    const updateModel = {
      accountId: this.data.accountId,
      percDiscount: 0,
      customSell: e.value,
      discountType: '$',
      products: this.productsList,
      discountFieldId: this.data.isJobber ? 2 : 1,
      createdByUserId: this.user.id,
      modifiedUserId: this.user.userId
    }

    // Send Updates
    this.dataService.updateDiscounts(updateModel).subscribe(data => {
      this.toastr.success('Discounts Updated', 'PaintCity Inc', { timeOut: 3000 });
      this.refreshProducts();
    },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Update Failed');
      });
  }

  categoryChanged(category) {
    this.searchProducts(category);
  }

  numYears_valueChanged(e) {
    this.numYears = e.value;
    this.GetClientHistory();
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
      accountId: this.data.accountId,
      invoiceId: this.data.invoiceId,
      active: this.active,
      inStock: this.inStock,
      companyId: this.user.companyId
    }

    let indexId = 0;
    this.ctr = 0;
    this.productsList = [];
    this.focusedRowKey = 0;
    this.isLoading = false;
    this.dataService.getProductsforInvoice(productParams).subscribe(data => {
      this.loadingVisible = false;
      data.forEach(p => {
        p.indexId = indexId++;
        this.productsList.push(p);
      });
      this.productCount = this.productsList.length + ' Products Found';
      this.isLoading = true;
    });
  }

  onContentReady = (e)=>{
    if (this.productsList === undefined){return;}
    if (this.productsList.length>0 && this.autoSelectQty){
      this.productsGrid.instance.editCell(this.focusedRowKey,'orderQty');
    }
  }

  GetClientHistory() {
    this.dataService.getClientHistory(this.data.accountId, this.data.invoiceId, this.numYears).subscribe(data => {
      this.clientHistory = data;
      this.filteredClientHistory = data;
      this.skuTextBox.instance.focus();
    });
  }

  onCellPrepared(e) {
    if (e.rowType === 'data' && e.column.dataField === 'inStockQty') {
      e.cellElement.style.color = e.data.inStockQty >= 0 ? 'black' : 'red';
    }

    if (e.rowType === 'data' && e.column.dataField === 'onOrderQty') {
      e.cellElement.style.color = e.data.onOrderQty >= 0 ? 'black' : 'red';
    }

    if (e.rowType === 'data' && e.column.dataField === 'orderQty') {
    }
  }

  

  quantityUpdated(e) {
    if (e.data.orderQty > 0) {
      this.selectedProducts.push(e.data);
    }

    if (e.data.orderQty==0){
      e.data.orderQty=1; 
    }

    if (e.data.paintUnit.length>0){
      this.selectedProducts.push(e.data);
    }

    //this.selectProductEvent.emit(e.data);
    this.focusedRowKey = this.focusedRowKey + 1;
    if (this.focusedRowKey<this.productsList.length){
      this.productsGrid.instance.editCell(this.focusedRowKey,'orderQty');
    }
    
  }

  selectProductClick(e) {
    e.row.data.orderQty = 1;
    this.selectedProducts.push(e.row.data);
    //this.selectProductEvent.emit(e.row.data);
  }

  editProductClick(e) {
    this.productdialogRef = this.dialog.open(ProductEditorDialogComponent, {
      data: {
        partLinkId: e.row.data.id,
      },
      height: '90%',
      width: '50%',
      panelClass: 'my-dialog'
    });
  }

  deleteItemClick(e) {
    const dtl = e.row.data;
    this.selectedProducts.forEach((item, index) => {
      if (item === dtl) { this.selectedProducts.splice(index, 1); }
    });
  }


  showQuantityBreaksClick(e) {
    this.productEditordialogRef = this.dialog.open(ProductEditorComponent, {
      data: {
        editorType: 'productSlabs',
        product: e.row.data
      },
      height: '500px',
      width: '500px',
      panelClass: 'my-dialog'
    });

    this.productEditordialogRef.afterClosed().subscribe(() => {
      this.refreshProducts();
    });
  }

  addedFromRequired(e) {
    //this.selectProductEvent.emit(e);
    this.selectedProducts.push(e);
  }

  selectProductfromHistoryClick(e) {
    const dtl = {
      id: e.row.data.partLinkId,
      line: e.row.data.line,
      sku: e.row.data.sku,
      description: e.row.data.description,
      cost: e.row.data.cost,
      sell: e.row.data.sell,
      orderQty: e.row.data.orderQty
    };
    //this.selectProductEvent.emit(dtl);
    this.selectedProducts.push(dtl);
  }

  quantityUpdatedFromHistory(e) {
    const dtl = {
      id: e.data.partLinkId,
      line: e.data.line,
      sku: e.data.sku,
      description: e.data.description,
      cost: e.data.cost,
      sell: e.data.sell,
      orderQty: e.data.orderQty
    };
    //this.selectProductEvent.emit(dtl);
    this.selectedProducts.push(dtl);
  }

  productChanged(e) {
    this.selectedProduct = e.row.data;
    this.filteredClientHistory = this.clientHistory.filter(f => f.partLinkId === e.row.data.id);
    this.quantityBreaks = e.row.data.quantityBreaks;
    this.dataService.getLinkedProducts(e.row.data.id, this.data.accountId, this.user.companyId).subscribe(data => {
      this.requiredProducts = data;
    });
  }

  ShowDiscounts(e) {
    this.clientMatrixDialogRef = this.dialog.open(ClientDiscountsDialogComponent, {
      data: {
        accountId: this.data.accountId,
        isJobber: this.data.isJobber
      },
      height: '70%',
      width: '70%'
    });
  }


  showProductAdd() {
    this.dialogNewProductRef = this.dialog.open(ProductAddDialogComponent,
      {
        height: '400px',
        width: '600px',
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



  public cancel() {
    this.close(false);
  }

  public close(value) {
    this.selectProductEvent.emit(this.selectedProducts);
    this.mdDialogRef.close(value);
  }
  public confirm() {
    this.close(true);
  }
  

  CloseClick() {
    this.close(true);
  }

  ngOnDestroy() {
    
  }

}
