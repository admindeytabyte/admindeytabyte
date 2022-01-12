import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-product-slab-editor',
  templateUrl: './product-slab-editor.component.html',
  styleUrls: ['./product-slab-editor.component.scss']
})
export class ProductSlabEditorComponent implements OnInit {
  @Input() product: any;
  errorMessage: any;
  productSlabs: any = [];
  copiedData: any[] = [];

  constructor(private dataService: DataService,
    private userService: UserService,
    private toastr: ToastrService) {
    this.calcSell = this.calcSell.bind(this);
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.dataService.GetQuantityBreaks(this.product.companyId, this.product.id).subscribe(data => {
      this.productSlabs = data;
    });
    this.copiedData = this.userService.getSlabs();
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'fa fa-copy',
          hint: 'Copy',
          onClick: this.CopyData.bind(this)
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'fa fa-paste',
          hint: 'Paste',
          onClick: this.PasteData.bind(this)
        }
      }
    );
  }

  CopyData() {
    this.userService.setSlabs(this.productSlabs);
  }

  PasteData() {
    if (this.copiedData === null) {
      this.errorMessage = 'No Data Found to Paste';
      this.toastr.error('No Data Found to Paste', 'Failed');
      return;
    }

    // Copy
    // this.productSlabs = this.copiedData;

    const attributes = {
      partLinkId: this.product.id,
      slabs: this.copiedData
    };

    this.dataService.updateProductAttributes(attributes).subscribe(
      (response) => {
        this.toastr.success('Copied Successfully!', 'Success', {
          timeOut: 2000,
        });
        this.loadData();
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error.error, 'Copy Failed');
      }
    );
  }

  calcSell(item) {
    return this.product.sell - (this.product.sell * item.discountPercentage / 100);
  }

  QuantityBreaksAdded(e: { data: any }) {
    e.data.partLinkId = this.product.id;
    e.data.companyId = this.product.companyId;
    this.dataService.AddQuantityBreaks(e.data).subscribe(
      (response) => {
        this.toastr.success('Added Successfully!', 'Success', {
          timeOut: 2000,
        });
        // Update Key of added entity from response object
        e.data.id = response['id'];
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error.error, 'Add Failed');
      }
    );
  }

  QuantityBreaksUpdated(e: any) {
    this.dataService.UpdateQuantityBreaks(e.data).subscribe(
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

  QuantityBreaksDeleted(e: any) {
    this.dataService.DeleteQuantityBreaks(e.data.id).subscribe(
      (response) => {
        this.toastr.success('Deleted Successfully!', 'Success', {
          timeOut: 2000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Delete Failed ' + this.errorMessage);
      }
    );
  }


}
