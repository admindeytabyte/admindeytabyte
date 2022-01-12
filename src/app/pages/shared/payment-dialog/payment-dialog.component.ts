import { UserService } from './../../services/user.service';
import { DataService } from './../../services/data.service';
import { Component, Inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent implements OnInit {
  user: any;
  client: any;
  paymentTypes: any[];
  paymentInvoices: any[] = [];
  paymentDate:  any;
  paymentNote: any;
  paymentType: any = null;
  paymentTotal = 0;
  errorMessage: string;
  invoice: any;

  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    accountId: any,
    invoiceId: any
  },
    private mdDialogRef: MatDialogRef<PaymentDialogComponent>,
    private dataService: DataService,
    private userService: UserService,
    private toastr: ToastrService) {
    this.user = this.userService.getUser();
  }

  ngOnInit() {
    this.paymentDate = new Date();
    this.dataService.GetClientInvoiceGenerics(this.data.accountId).subscribe(data => {
      this.client = data.client;
      this.paymentTypes = data.paymentTypes;
    });
    this.dataService.GetInvoiceForPayment(this.data.invoiceId).subscribe(data => {
      this.invoice = data;
      this.paymentTotal = data.balance;
    });
  }

  paymentClick(e) {
    if (this.paymentType === null) {
      this.errorMessage = 'Payment Type Cannot be Empty';
      return;
    }

    if (this.paymentTotal === 0) {
      this.errorMessage = 'Payment Cannot be Zero';
      return;
    }

    if (this.paymentTotal > this.invoice.balance) {
      this.errorMessage = 'Payment Cannot be more than the balance';
      return;
    }

    this.invoice.appliedPayment = this.paymentTotal;
    this.paymentInvoices.push(this.invoice);

    const paymentModel = {
      accountId: this.data.accountId,
      paymentTypeId: this.paymentType,
      paymentDate: this.paymentDate,
      paymentNote: this.paymentNote,
      paymentAmount: this.paymentTotal,
      loggedBy: this.user.userId,
      loggedById: this.user.id,
      invoices: this.paymentInvoices
    }

    this.dataService.logClientPayment(paymentModel).subscribe(data => {
      this.toastr.success('Payment Success', 'PaintCity Inc', { timeOut: 1000 });
      this.errorMessage = null;
      this.mdDialogRef.close(true);
    },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Payment Failed');
      });
  }

  CloseClick() {
    this.mdDialogRef.close(true);
  }
}
