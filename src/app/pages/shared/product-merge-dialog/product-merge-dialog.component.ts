import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DxTextBoxComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';
import { InputDialogComponent } from '../input-dialog/input-dialog.component';

@Component({
  selector: 'app-product-merge-dialog',
  templateUrl: './product-merge-dialog.component.html',
  styleUrls: ['./product-merge-dialog.component.scss']
})
export class ProductMergeDialogComponent implements OnInit {
  @ViewChild("skuTextBox", { static: false }) skuTextBox: DxTextBoxComponent;
  categories: any[];
  productLines: any[];
  line: string;
  sku: string;
  description: string;
  combination: string;
  productsList: any[];
  loadingVisible: boolean;
  inputDialogRef: MatDialogRef<InputDialogComponent>;
  errorMessage: any;

  constructor(private dataService: DataService,
    private dialog: MatDialog,private toastr: ToastrService,
    private mdDialogRef: MatDialogRef<InputDialogComponent>) { 
    this.mergeCategoryClick = this.mergeCategoryClick.bind(this);
    this.mergeLineClick = this.mergeLineClick.bind(this);
    this.mergeProductClick = this.mergeProductClick.bind(this);
    this.deleteCategoryClick = this.deleteCategoryClick.bind(this);
    this.deleteProductLineClick = this.deleteProductLineClick.bind(this);
    this.deleteProductClick = this.deleteProductClick.bind(this);
  }

  ngOnInit() {
    this.RefreshCategories();
    this.RefreshProductLines();
    this.skuTextBox.instance.focus();
    //this.sku= 'nh731';
    //this.refreshProducts();
  }

  @HostListener('keydown.esc', ['$event'])
  public onEsc() {
    this.mdDialogRef.close();
  }

  @HostListener('window:keydown.Control.r', ['$event'])
  onKeyDownControlR(e) {
    e.preventDefault();
    this.reset();
  }

  RefreshCategories() {
    this.dataService.GetAllCategories().subscribe(data => {
      this.categories = data;
    });
  }

  RefreshProductLines() {
    this.dataService.GetAllProductLines().subscribe(data => {
      this.productLines = data;
    });
  }

  categoryFocusChanged(e) {
    this.dataService.getProductsByCategory(e.row.data.categoryId).subscribe(data => {
      this.productsList = data;
    });
  }

  lineFocusChanged(e) {
    this.dataService.getProductsByLine(e.row.data.lineId).subscribe(data => {
      this.productsList = data;
    });
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

  reset() {
    this.line = '';
    this.sku = '';
    this.description = '';
    this.combination = '';
    this.skuTextBox.instance.focus();
  }


  refreshProducts() {
    const productParams = {
      categoryId: 0,
      line: this.line !== undefined ? this.line : '',
      sku: this.sku !== undefined ? this.sku : '',
      description: this.description !== undefined ? this.description : '',
      combination: this.combination !== undefined ? this.combination : ''
    }

    this.dataService.getProductsforMerge(productParams).subscribe(data => {
      this.loadingVisible = false;
      this.productsList = data;
    });
  }

  mergeCategoryClick(e){
    this.inputDialogRef = this.dialog.open(InputDialogComponent, {
      disableClose: true,
      data: {
        message: 'Enter Category ID to Merge...',
      },
      height: '10%',
      width: '15%',
      panelClass: 'my-dialog'
    });

    const sub = this.inputDialogRef.componentInstance.responseEvent.subscribe((data) => {
      //Process Data
      const productParams = {
        srcCategoryId: e.row.data.categoryId,
        destCategoryId: data
      }

      this.loadingVisible=true;
      this.dataService.mergeCategory(productParams).subscribe(data => {
        this.toastr.success('Merge Complete', 'PaintCity Inc', { timeOut: 3000 });
        this.RefreshCategories();
        this.loadingVisible=false;
      },
        (error) => {
          this.errorMessage = error.error;
          this.loadingVisible=false;
          this.toastr.error('Merge Failed');
        });
    });

    this.inputDialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  
  onCategoryCellPrepared(e) {
    if (e.rowType === 'data' && e.column.type === 'buttons' && e.column.visibleIndex === 5) {
      if (e.row.data.numberProducts > 0) {
        e.cellElement.hidden = true;
      }
    }

  }

  onProductLineCellPrepared(e) {
    if (e.rowType === 'data' && e.column.type === 'buttons' && e.column.visibleIndex === 6) {
      if (e.row.data.productCount > 0) {
        e.cellElement.hidden = true;
      }
    }

  }

  onProductsCellPrepared(e) {
    if (e.rowType === 'data' && e.column.type === 'buttons' && e.column.visibleIndex === 9) {
      if (e.row.data.numSold > 0) {
        e.cellElement.hidden = true;
      }
    }

  }

  

  mergeLineClick(e){
    this.inputDialogRef = this.dialog.open(InputDialogComponent, {
      disableClose: true,
      data: {
        message: 'Enter Line ID to Merge...',
      },
      height: '10%',
      width: '15%',
      panelClass: 'my-dialog'
    });

    const sub = this.inputDialogRef.componentInstance.responseEvent.subscribe((data) => {
      //Process Data
      const productParams = {
        srcLineId: e.row.data.lineId,
        destLineId: data
      }

      this.loadingVisible=true;
      this.dataService.mergeLines(productParams).subscribe(data => {
        this.toastr.success('Merge Complete', 'PaintCity Inc', { timeOut: 3000 });
        this.RefreshProductLines();
        this.loadingVisible=false;
      },
        (error) => {
          this.errorMessage = error.error;
          this.loadingVisible=false;
          this.toastr.error('Merge Failed');
        });
    });

    this.inputDialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  mergeProductClick(e){
    this.inputDialogRef = this.dialog.open(InputDialogComponent, {
      disableClose: true,
      data: {
        message: 'Enter Product ID to Merge...',
      },
      height: '10%',
      width: '15%',
      panelClass: 'my-dialog'
    });

    const sub = this.inputDialogRef.componentInstance.responseEvent.subscribe((data) => {
      //Process Data
      
      const productParams = {
        srcPartLinkId: e.row.data.id,
        destPartLinkId: data
      }

      this.loadingVisible=true;
      this.dataService.mergeProducts(productParams).subscribe(data => {
        this.toastr.success('Merge Complete', 'PaintCity Inc', { timeOut: 3000 });
        this.refreshProducts();
        this.loadingVisible=false;
      },
        (error) => {
          this.errorMessage = error.error;
          this.toastr.error('Merge Failed');
          this.loadingVisible=false;
        });
    });

    this.inputDialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  deleteCategoryClick(e){
    if (e.row.data.numberProducts>0){
      this.toastr.error('Cannot Delete Products Exist', 'PaintCity Inc', { timeOut: 5000 });
      return;
    }

    this.dataService.DeleteCategories(e.row.data.categoryId).subscribe(
      (response) => {
        this.toastr.success('Category Deleted Successfully!', 'Success', {
          timeOut: 3000,
        });
        this.RefreshCategories();
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Category Delete Failed ');
      }
    );

  }

  deleteProductLineClick(e){
    if (e.row.data.productCount>0){
      this.toastr.error('Cannot Delete Products Exist', 'PaintCity Inc', { timeOut: 5000 });
      return;
    }

    this.dataService.DeleteProductLines(e.row.data.lineId).subscribe(
      (response) => {
        this.toastr.success('Product Line Deleted Successfully!', 'Success', {
          timeOut: 3000,
        });
        this.RefreshProductLines();
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Product Line Delete Failed ');
      }
    );
  }

  deleteProductClick(e){
    if (e.row.data.numSold>0){
      this.toastr.error('Cannot Delete Products Exist', 'PaintCity Inc', { timeOut: 5000 });
      return;
    }

    this.dataService.DeleteProduct(e.row.data.id).subscribe(
      (response) => {
        this.toastr.success('Product Deleted Successfully!', 'Success', {
          timeOut: 3000,
        });
        this.refreshProducts();
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Product  Delete Failed ');
      }
    );
  }

  categoryUpdated(e: any) {
    this.dataService.updateCategory(e.data).subscribe(
      (response) => {
        this.toastr.success('Category Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Category Update Failed');
      }
    );
  }

  productLineUpdated(e: any) {
    this.dataService.updateProductLine(e.data).subscribe(
      (response) => {
        this.toastr.success('Line Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Line Update Failed');
      }
    );
  }

  productUpdated(e: any) {
    this.dataService.updateProduct(e.data).subscribe(
      (response) => {
        this.toastr.success('Product Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Product Update Failed');
      }
    );
  }


  CloseClick(){
    this.mdDialogRef.close();
  }

}
