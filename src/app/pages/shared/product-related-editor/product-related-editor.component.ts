import { UserService } from './../../services/user.service';
import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';

@Component({
  selector: 'app-product-related-editor',
  templateUrl: './product-related-editor.component.html',
  styleUrls: ['./product-related-editor.component.scss']
})
export class ProductRelatedEditorComponent implements OnInit {
  @Input() partLinkId: number;
  relatedProducts: any[];
  productLinkTypes: any[];
  parent: any;
  errorMessage: any;

  dialogRef: MatDialogRef<ProductDialogComponent>;
  user: any;
  constructor(private dataService: DataService,
    private userService: UserService,
    private toastr: ToastrService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.dataService.GetProductLinkTypes().subscribe(data => {
      this.productLinkTypes = data;
    });
    this.RefreshRelatedProducts();
  }

  onGridToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'search',
          hint: 'Product Search',
          onClick: this.showProductLookup.bind(this)
        }
      }
    );
  }

  showProductLookup(e) {
    this.dialogRef = this.dialog.open(ProductDialogComponent,
      {
        data: {
          invoiceId: 0,
          accountId: 0,
          parentType: 'products'
        },
        height: '70%',
        width: '60%',
        panelClass: 'my-dialog'
      });

    const sub = this.dialogRef.componentInstance.selectProductEvent.subscribe((data) => {
      this.productSelected(data);
    });

    this.dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  RefreshRelatedProducts() {
    this.dataService.GetRelatedProducts(this.partLinkId, this.user.companyId).subscribe(data => {
      this.relatedProducts = data.products;
      this.parent = data.parent;
    });
  }

  productSelected(e) {
    const product = {
      companyId: this.user.companyId,
      linkTypeId: 1,
      partLinkId: this.parent.id,
      altPartLinkId: e.id
    };
    this.dataService.AddRelatedProduct(product).subscribe(
      (response) => {
        this.toastr.success('Added Successfully!' + e.description, 'Success', {
          timeOut: 2000,
        });
        this.RefreshRelatedProducts();
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error.error, 'Add Failed');
      }
    );
  }


  ProductRelatedUpdated(e: any) {
    this.dataService.UpdateRelatedProduct(e.data).subscribe(
      (response) => {
        this.toastr.success('Updated Successfully!', 'Success', {
          timeOut: 2000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error, 'Update Failed');
      }
    );
  }

  ProductRelatedDeleted(e: any) {
    this.dataService.DeleteRelatedProduct(e.data.id).subscribe(
      (response) => {
        this.toastr.success('Deleted Successfully!', 'Success', {
          timeOut: 2000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Delete Failed ' + this.errorMessage);
        this.RefreshRelatedProducts();
      }
    );
  }

}
