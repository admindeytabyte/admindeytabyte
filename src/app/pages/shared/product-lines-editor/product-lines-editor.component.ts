import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-product-lines-editor',
  templateUrl: './product-lines-editor.component.html',
  styleUrls: ['./product-lines-editor.component.scss']
})
export class ProductLinesEditorComponent implements OnInit {
  productLines: any[];
  productLineTypes: any[];
  errorMessage: any;
  user: any;

  constructor(private dataService: DataService,
    private userService: UserService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.RefreshProductLines();
  }

  RefreshProductLines() {
    this.dataService.GetProductLines().subscribe(data => {
      this.productLines = data;
    });

    this.dataService.GetProductLineTypes().subscribe(data => {
      this.productLineTypes = data;
    });
  }

  ProductLinesAdded(e: { data: any }) {
    e.data.lineId = 0;
    e.data.companyId = this.user.companyId;
    this.dataService.AddProductLines(e.data).subscribe(
      (response) => {
        this.toastr.success('Added Successfully!', 'Success', {
          timeOut: 2000,
        });
        // Update Key of added entity from response object
        e.data.categoryId = response['lineId'];
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error.error, 'Add Failed');
      }
    );
  }

  ProductLinesUpdated(e: any) {
    e.data.companyId = this.user.companyId;
    this.dataService.UpdateProductLines(e.data).subscribe(
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

  ProductLinesDeleted(e: any) {
    this.dataService.DeleteProductLines(e.data.lineId).subscribe(
      (response) => {
        this.toastr.success('Deleted Successfully!', 'Success', {
          timeOut: 2000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Delete Failed ' + this.errorMessage);
        this.RefreshProductLines();
      }
    );
  }


}
