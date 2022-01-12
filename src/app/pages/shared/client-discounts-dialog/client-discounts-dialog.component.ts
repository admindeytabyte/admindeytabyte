import { ToastrService } from 'ngx-toastr';
import { DataService } from './../../services/data.service';
import { UserService } from './../../services/user.service';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvoiceMiniViewComponent } from '../invoice-mini-view/invoice-mini-view.component';

@Component({
  selector: 'app-client-discounts-dialog',
  templateUrl: './client-discounts-dialog.component.html',
  styleUrls: ['./client-discounts-dialog.component.scss']
})
export class ClientDiscountsDialogComponent implements OnInit {
  @Input() accountId: number;
  @Input() isJobber: boolean;
  user: any;
  discountTypes: any[];
  discountFields: any[];
  clientDiscounts: any[];
  errorMessage: any;
  dataLoading = false;
  isRetail = false;
  showCloseButton: Boolean = false;
  miniInvoicedialogRef: MatDialogRef<InvoiceMiniViewComponent>;
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: { accountId: any, isJobber: boolean },
    private userService: UserService,
    private dataService: DataService,
    private toastr: ToastrService,
    private mdDialogRef: MatDialogRef<ClientDiscountsDialogComponent>,
    private dialog: MatDialog) {
    this.editInvoiceClick = this.editInvoiceClick.bind(this);
  }

  ngOnInit() {
    if (this.data.accountId !== undefined) {
      this.accountId = this.data.accountId;
      this.isJobber = this.data.isJobber;
      this.isRetail = !this.isJobber;
      this.showCloseButton = true;
    }
    this.user = this.userService.getUser();
    this.refreshDiscounts();
    this.dataService.getDiscountGenerics().subscribe(data => {
      this.discountTypes = data.discountTypes;
      this.discountFields = data.discountFields;
    });
  }

  onGridToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'before',
        widget: 'dxButton',
        width: 250,
        options: {
          text: 'Create Maps',
          onClick: this.createMaps.bind(this)
        }
      },
      {
        location: 'before',
        width: 250,
        widget: 'dxButton',
        options: {
          text: 'Delete Maps',
          onClick: this.deleteMaps.bind(this)
        }
      },
      {
        location: 'before',
        width: 250,
        widget: 'dxButton',
        options: {
          text: 'Refresh Maps',
          onClick: this.refreshDiscounts.bind(this)
        }
      },
      {
        location: 'before',
        widget: 'dxCheckBox',
        options: {
          width: 80,
          text: 'Jobber',
          value: this.isJobber
        }
      }
    );
  }

  onCellPrepared(e) {
    if (e.rowType === 'data' && e.column.dataField === 'discountValue') {
      e.cellElement.style.color = e.data.discountValue > 0 ? 'green' : 'red';
    }
  }

  createMaps() {
    const mapModel = {
      accountId: this.accountId,
      createdByUserId: this.user.id,
      modifiedUserId: this.user.userId,
      discountFieldId: this.isJobber === true ? 2 : 1
    };
    this.dataLoading = true;


    this.dataService.CreateCustomerDiscounts(mapModel).subscribe(
      (response) => {
        this.toastr.success('Maps Created Successfully!', 'Success', {
          timeOut: 3000,
        });
        this.dataLoading = false;
        this.refreshDiscounts();
      },
      (error) => {
        this.dataLoading = false;
        this.errorMessage = error.error;
        this.toastr.error(error, 'Update Failed');
      }
    );

  }

  deleteMaps() {
    const mapModel = {
      accountId: this.accountId
    };

    this.dataService.DiscountsBatchDelete(mapModel).subscribe(data => {
      this.refreshDiscounts();
    });
  }

  refreshDiscounts() {
    this.dataService.getClientDiscounts(this.accountId, this.user.companyId).subscribe(data => {
      this.clientDiscounts = data;
    });
  }

  // calculateCustomSell(data) {
  //   return data.discountFieldId === 1 ? data.retailSell * (1 - data.discountValue) : data.jobber * (1 - data.discountValue);
  // }

  calculateDiscount(data) {
    data.discountValue = data.discountFieldId === 1
      ? data.sell > 0 ? 1 - (data.customSell / data.sell) : 0
      : data.jobber > 0 ? 1 - (data.customSell / data.jobber) : 0;
    return data.discountValue;
  }

  clientDiscountUpdated(e: any) {
    e.data.modifiedBy = this.user.userId;
    this.dataService.UpdateCustomerDiscounts(e.data).subscribe(
      (response) => {
        this.toastr.success('Discount Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
        this.refreshDiscounts();
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error, 'Discount Update Failed');
      }
    );
  }

  clientDiscountsDeleted(e: any) {
    this.dataService.DeleteCustomerDiscounts(e.data.id).subscribe(
      (response) => {
        this.toastr.success('Discount Deleted Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Discount Delete Failed ' + this.errorMessage);
        this.refreshDiscounts();
      }
    );
  }

  editInvoiceClick(e) {
    this.miniInvoicedialogRef = this.dialog.open(InvoiceMiniViewComponent, {
      data: {
        invoiceId: e.row.data.invoiceId
      },
      height: '60%',
      width: '50%'
    });
  }

  // public close(value) {
  //   this.mdDialogRef.close(value);
  // }

  CloseClick() {
    this.mdDialogRef.close(true);
  }



}
