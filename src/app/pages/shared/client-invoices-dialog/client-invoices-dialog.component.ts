import { UserService } from './../../services/user.service';
import { PaymentDialogComponent } from './../payment-dialog/payment-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InvoiceDialogComponent } from './../invoice-dialog/invoice-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { DataService } from './../../services/data.service';
import { Component, OnInit, Input } from '@angular/core';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-client-invoices-dialog',
  templateUrl: './client-invoices-dialog.component.html',
  styleUrls: ['./client-invoices-dialog.component.scss']
})
export class ClientInvoicesDialogComponent implements OnInit {
  @Input() accountId: number;
  invoices: any[];
  balanceFilter = true;
  quotations: any[];
  errorMessage: any;
  dialogRef: MatDialogRef<InvoiceDialogComponent>;
  clientPaymentDialogRef: MatDialogRef<PaymentDialogComponent>;
  confDialogRef: MatDialogRef<ConfirmDialogComponent>;
  user: any;
  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private mdDialogRef: MatDialogRef<ClientInvoicesDialogComponent>,
    private userService: UserService,
    private dialog: MatDialog) {

    this.editInvoiceClick = this.editInvoiceClick.bind(this);
    this.payInvoiceClick = this.payInvoiceClick.bind(this);
    this.closeInvoiceClick = this.closeInvoiceClick.bind(this);
  }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.refreshInvoices();
  }

  checkRole(roleId: any) {
    return this.userService.checkRole(roleId);
  }

  oninvoiceGridToolbarPreparing(e: { toolbarOptions: { items: any } }) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxCheckBox',
        options: {
          class: 'balanceCheckBox',
          hint: 'With a Balance',
          onValueChanged: this.SetBalanceFilter.bind(this),
          value: true,
          text: 'With Balance'
        }
      });
  }

  closeInvoiceClick(e) {
    // Close Invoice without Payment
    e.row.data.updateUserId = this.user.id;
    console.log(e.row.data);
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

  onCellPrepared(e) {

    if (e.rowType === 'data' && e.column.type === 'buttons' && e.column.visibleIndex === 1) {
      if (e.row.data.statusOrder <= 10 || e.row.data.statusOrder >= 12) {
        e.cellElement.hidden = true;
      }
    }

  }



  refreshInvoices() {
    this.dataService.getClientInvoices(this.accountId, false).subscribe(data => {
      this.invoices = this.balanceFilter === true
        ? data.filter(item => item.invoiceTypeCde !== 'Q' && item.balance !== 0)
        : data.filter(item => item.invoiceTypeCde !== 'Q');

      this.quotations = data.filter(
        item => item.invoiceTypeCde === 'Q');
    });
  }



  SetBalanceFilter(e) {
    this.balanceFilter = e.value;
    this.refreshInvoices();
  }

  editInvoiceClick(e) {
    this.dialogRef = this.dialog.open(InvoiceDialogComponent, {
      data: {
        invoiceId: e.row.data.invoiceId
      },
      height: '99%',
      width: '95%'
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshInvoices();
      }
    });

  }

  payInvoiceClick(e) {
    this.clientPaymentDialogRef = this.dialog.open(PaymentDialogComponent, {
      data: {
        accountId: this.accountId,
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

  public CloseClick() {
    this.mdDialogRef.close(true);
  }

}
