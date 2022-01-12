import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../../services/data.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-product-add-dialog',
  templateUrl: './product-add-dialog.component.html',
  styleUrls: ['./product-add-dialog.component.scss']
})
export class ProductAddDialogComponent implements OnInit {
  @Output() newProductEvent: EventEmitter<any> = new EventEmitter<any>();
  newProduct: any;
  errorMessage: any;
  categories: any[];
  productLines: any[];
  buttonOptions: any = {
    text: 'Add',
    type: 'success',
    useSubmitBehavior: true
  }
  user: any;


  constructor(private dataService: DataService,
    private toastr: ToastrService,
    private userService: UserService,
    private mdDialogRef: MatDialogRef<ProductAddDialogComponent>) {
  }

  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.dataService.GetProductStatics().subscribe(data => {
      this.categories = data.categories;
      this.productLines = data.productLines;
    });
  }

  onFormSubmit = function (e) {
    this.newProduct.companyId = this.user.companyId;
    this.dataService.AddProduct(this.newProduct).subscribe(
      (response) => {
        this.toastr.success('Product Added Successfully!', 'Success', {
          timeOut: 2000,
        });
        this.newProductEvent.emit(this.newProduct);
        this.mdDialogRef.close();
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Product Add Failed');
      }
    );
    e.preventDefault();
  }

  CloseClick() {
    this.mdDialogRef.close();
  }

  form_fieldDataChanged(e) {
    this.newProduct = e.component.option('formData');
  }

}
