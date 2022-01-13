import { PaymentDialogComponent } from './../payment-dialog/payment-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from './../confirm-dialog/confirm-dialog.component';
import { UserService } from './../../services/user.service';
import { DataService } from './../../services/data.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvoiceDialogComponent } from '../invoice-dialog/invoice-dialog.component';

@Component({
  selector: 'app-dispatchlog-editor',
  templateUrl: './dispatchlog-editor.component.html',
  styleUrls: ['./dispatchlog-editor.component.scss']
})
export class DispatchlogEditorComponent implements OnInit {
  user: any;
  invoices: any[];
  confDialogRef: MatDialogRef<ConfirmDialogComponent>;
  clientPaymentDialogRef: MatDialogRef<PaymentDialogComponent>;
  dialogRef: MatDialogRef<InvoiceDialogComponent>;
  errorMessage: any;
  selectedInvoice: any;
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    dispatchId: any,
    dispatchNum: any,
  },
    private dataService: DataService,
    private userService: UserService,
    private toastr: ToastrService,
    private mdDialogRef: MatDialogRef<DispatchlogEditorComponent>,
    private dialog: MatDialog,
  ) {
    this.closeInvoiceClick = this.closeInvoiceClick.bind(this);
    this.payInvoiceClick = this.payInvoiceClick.bind(this);
    this.editInvoiceClick = this.editInvoiceClick.bind(this);
  }

  ngOnInit() {
    this.user = this.userService.getUser();
    if (this.data.dispatchNum !== undefined) {
      this.refreshInvoicesByNum();
      return;
    }
    this.refreshInvoices();
  }

  refreshInvoices() {
    this.dataService.getDispatchLogInvoices(this.data.dispatchId).subscribe(data => {
      this.invoices = data;
      if (this.invoices.filter(f => f.statusGroup === 'Open').length === 0) {
        //Update Log Status as Closed
        this.dataService.CloseDriverLog(this.data.dispatchId).subscribe(
          (response) => {
            this.toastr.success('Updated Successfully!', 'Success', {
              timeOut: 3000,
            });
            this.CloseClick();
          },
          (error) => {
            this.errorMessage = error.error;
            this.toastr.error(error, 'Log Update Failed');
          }
        );
      }
    });
  }

  refreshInvoicesByNum() {
    this.dataService.getDispatchLogInvoicesByNumber(this.data.dispatchNum, this.user.companyId).subscribe(data => {
      this.invoices = data;
    });
  }

  customizeValue(data) {
    return "Cash: $" + data.value;
  }

  onCellPrepared(e) {
    if (e.rowType === 'data' && e.column.type === 'buttons') {
      if (e.row.data.statusGroup === 'Closed' && e.column.visibleindex > 0) {
        e.cellElement.hidden = true;
      }
    }
  }

  editInvoiceClick(e) {
    this.dialogRef = this.dialog.open(InvoiceDialogComponent, {
      data: {
        invoiceId: e.row.data.invoiceId
      },
      height: '99%',
      width: '95%'
    });

  }

  invoiceSelectionChanged(e) {
    this.selectedInvoice = e.row.data;
  }


  closeInvoiceClick(e) {
    // Close Invoice without Payment
    e.row.data.updateUserId = this.user.id;
    this.dataService.closeInvoice(e.row.data).subscribe(res => {
      this.toastr.success('Closed on Account', 'PaintCity Inc', { timeOut: 3000 });
      this.refreshInvoices();
    },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Failed');
    });
    // this.confDialogRef = this.dialog.open(ConfirmDialogComponent, {
    //   data: {
    //     title: 'Confirm',
    //     message: 'Do you want to Close the Invoice without a Payment?'
    //   }, height: '200px', width: '600px', panelClass: 'my-dialog'
    // });

    // const sub = this.confDialogRef.componentInstance.confirmEvent.subscribe((data) => {
    //   if (data === true) {
        
    //   }
    // });

    // this.confDialogRef.afterClosed().subscribe(() => {
    //   sub.unsubscribe();
    // });
  }

  payInvoiceClick(e) {
    this.clientPaymentDialogRef = this.dialog.open(PaymentDialogComponent, {
      data: {
        accountId: e.row.data.accountId,
        invoiceId: e.row.data.invoiceId
      },
      height: '40%',
      width: '50%',
      panelClass: 'my-dialog'
    });

    this.clientPaymentDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshInvoices();
      }
    });
  }

  CloseClick() {
    this.mdDialogRef.close(true);
  }

}
