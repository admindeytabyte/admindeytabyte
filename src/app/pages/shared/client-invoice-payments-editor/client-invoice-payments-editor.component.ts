import { AccountBalanceComponent } from './../account-balance/account-balance.component';
import { UserService } from './../../services/user.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ToastrService } from 'ngx-toastr';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InvoiceDialogComponent } from '../invoice-dialog/invoice-dialog.component';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-client-invoice-payments-editor',
  templateUrl: './client-invoice-payments-editor.component.html',
  styleUrls: ['./client-invoice-payments-editor.component.scss']
})
export class ClientInvoicePaymentsEditorComponent implements OnInit {
  @Input() accountId: number;
  @ViewChild(AccountBalanceComponent) balances: AccountBalanceComponent;
  invoices: any[];
  paymentInvoices: any[] = [];
  selectedMonths: any[] = [];
  paymentTypes: any[];
  errorMessage: any;
  clientPayments: any[];
  paymentMaps: any[];
  client: any;
  paymentDate: any;
  paymentNote: any;
  paymentType: any = null;
  paymentTotal = 0;
  AvailableAmount = 0;
  notCalculated = true;
  paymentsPending = false;
  user: any;
  messageDialog: MatDialogRef<MessageDialogComponent>;
  dialogRef: MatDialogRef<InvoiceDialogComponent>;
  clientPaymentDialogRef: MatDialogRef<PaymentDialogComponent>;
  confDialogRef: MatDialogRef<ConfirmDialogComponent>;
  invoicesFilter: boolean = true;
  invoicesData: any[];
  collectioninvoices: any[];
  constructor(private dataService: DataService,
    private mdDialogRef: MatDialogRef<ClientInvoicePaymentsEditorComponent>,
    private userService: UserService,
    private toastr: ToastrService,
    private dialog: MatDialog) {
    this.user = this.userService.getUser();
    this.clientPaymentDeleted = this.clientPaymentDeleted.bind(this);
    this.refreshInvoices = this.refreshInvoices.bind(this);
    this.editInvoiceClick = this.editInvoiceClick.bind(this);
    this.payInvoiceClick = this.payInvoiceClick.bind(this);
    this.collectionsClick = this.collectionsClick.bind(this);
    this.reversecollectionsClick = this.reversecollectionsClick.bind(this);
  }

  ngOnInit(): void {
    this.paymentDate= new Date();
    this.dataService.GetClientInvoiceGenerics(this.accountId).subscribe(data => {
      this.client = data.client;
      this.paymentTypes = data.paymentTypes;
    });
    this.refreshInvoices();
    this.refreshPayments();
  }

  onPaymentGridToolbarPreparing(e: { toolbarOptions: { items: any } }) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        width: 250,
        widget: 'dxButton',
        options: {
          text: 'Refresh',
          onClick: this.refreshPayments.bind(this)
        }
      },
    );
  }

  onCellPrepared(e) {
    if (e.rowType === 'data' && e.column.dataField === 'billed') {
      e.cellElement.style.color = e.data.billed >= 0 ? 'black' : 'red';
    }

    if (e.rowType === 'data' && e.column.dataField === 'balance') {
      e.cellElement.style.color = e.data.balance >= 0 ? 'black' : 'red';
    }

    if (e.rowType === 'data' && e.column.dataField === 'overDueDays') {
      e.cellElement.style.color = e.data.overDueDays >= 0 ? 'black' : 'red';
    }


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

  collectionsClick(e) {

    this.confDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Collection',
        message: 'Do you want to mark the Invoice ' + e.row.data.invoiceNumber + ' for Collections?'
      }, height: '200px', width: '600px', panelClass: 'my-dialog'
    });

    const sub = this.confDialogRef.componentInstance.confirmEvent.subscribe((data) => {
      if (data === true) {
        // Send Invoice for Collections
        const model = {
          invoiceId: e.row.data.invoiceId,
          loggedBy: this.user.userId,
          loggedById: this.user.id
        }

        this.dataService.logCollection(model).subscribe(data => {
          this.toastr.success('Logged Successfully', 'PaintCity Inc', { timeOut: 1000 });
          this.refreshInvoices();
        },
          (error) => {
            this.errorMessage = error.error;
            this.toastr.error('Transaction Failed');
          });
      }
    });

    this.confDialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });

  }

  reversecollectionsClick(e) {

    this.confDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Reverse Collection',
        message: 'Do you want to reverse ' + e.row.data.invoiceNumber + ' from Collections?'
      }, height: '200px', width: '600px', panelClass: 'my-dialog'
    });

    const sub = this.confDialogRef.componentInstance.confirmEvent.subscribe((data) => {
      if (data === true) {
        // Send Invoice for Collections
        const model = {
          invoiceId: e.row.data.invoiceId,
          loggedBy: this.user.userId,
          loggedById: this.user.id
        }

        this.dataService.reverseCollection(model).subscribe(data => {
          this.toastr.success('Reversed Successfully', 'PaintCity Inc', { timeOut: 1000 });
          this.refreshInvoices();
        },
          (error) => {
            this.errorMessage = error.error;
            this.toastr.error('Transaction Failed');
          });
      }
    });

    this.confDialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });

  }

  checkRole(roleId: any) {
    return this.userService.checkRole(roleId);
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


  calculatePayments() {
    if (this.AvailableAmount === 0) {
      this.errorMessage = 'Payment Cannot be Zero';
      return;
    }

    const model = {
      accountId: this.accountId,
      invoiceType: this.invoicesFilter,
      paymentAmount: this.AvailableAmount,
      selectedMonths: this.selectedMonths
    }

    this.dataService.GetClientPendingInvoicesPreview(model).subscribe(data => {
      this.paymentInvoices = [];
      this.invoices = data;
      this.paymentTotal = 0;
      this.paymentDate = new Date();
      this.AvailableAmount = 0;
      this.paymentTotal = 0;
      this.notCalculated = false;
      this.invoices.filter(f => f.previewMode === true).forEach(invoice => {
        invoice.calcBalance = invoice.balance - invoice.appliedPayment;
        this.paymentTotal = this.paymentTotal + invoice.appliedPayment;
        this.paymentInvoices.push(invoice);
      });
    });
  }

  refreshInvoices() {
    this.paymentInvoices = [];
    this.invoices = [];
    this.selectedMonths = [];
    this.invoicesData = [];
    this.notCalculated = true;
    this.dataService.GetClientPendingInvoices(this.accountId, this.invoicesFilter).subscribe(data => {
      this.invoicesData = data;
      this.paymentTotal = 0;
      this.SetInvoiceFilter(null);
      this.balances.refresh();
      this.paymentDate = new Date();
      this.AvailableAmount = 0;
    });


    this.dataService.GetClientCollections(this.accountId).subscribe(data => {
      this.collectioninvoices = data;
    });

  }

  refreshPayments() {
    this.dataService.GetClientPayments(this.accountId).subscribe(data => {
      this.clientPayments = data;
      this.balances.refresh();
    });
  }

  getDetails(e) {
    return e.data.paymentsMap;
  }

  clientPaymentDeleted(e) {
    this.dataService.reverseClientPayment(e.row.data).subscribe(data => {
      this.toastr.success('Reversal Success', 'PaintCity Inc', { timeOut: 1000 });
      this.refreshPayments();
    },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Payment Failed');
      });
  }

  AmountChanged(e) {

    // if (this.paymentInvoices.length > 0) {
    //   this.messageDialog = this.dialog.open(MessageDialogComponent, {
    //     data: {
    //       message: 'A pending Payment already exists. Please reset to calculate a new Amount'
    //     },
    //     height: '200px',
    //     width: '600px',
    //     panelClass: 'my-dialog'
    //   });
    //   return;
    // }


    // this.paymentInvoices = [];
    // this.paymentTotal = 0;
    // let availableAmount = e.value;
    // let endLoop = false;
    // this.selectedInvoices
    //   .sort((a, b) => a.invoiceId < b.invoiceId ? -1 : a.invoiceId > b.invoiceId ? 1 : 0)
    //   .forEach(invoice => {
    //     if (endLoop === false) {
    //       if (invoice.balance <= availableAmount) {
    //         invoice.isSelected = true;
    //         this.paymentTotal += invoice.balance;
    //         availableAmount = availableAmount - invoice.balance;
    //         invoice.paid = invoice.balance;
    //         invoice.balance = 0;
    //         this.paymentInvoices.push(invoice);
    //       } else {
    //         invoice.isSelected = true;
    //         invoice.paid = invoice.paid + availableAmount;
    //         invoice.balance = invoice.balance - availableAmount;
    //         this.paymentTotal += availableAmount;
    //         availableAmount = 0;
    //         endLoop = true;
    //         this.paymentInvoices.push(invoice);
    //       }
    //     }
    //   });
  }

  selectionChanged(cell, e) {
    const invoice = cell.row.data;
    if (invoice !== undefined) {
      invoice.isSelected = e.value;
      if (e.value === true) {
        invoice.appliedPayment = invoice.balance;
        invoice.calcBalance = invoice.balance - invoice.appliedPayment;
        this.paymentTotal = this.paymentTotal + invoice.balance;
        this.paymentInvoices.push(invoice);
      } else {
        invoice.appliedPayment = 0;
        invoice.calcBalance = invoice.balance;
        const objIndex = this.paymentInvoices.findIndex(obj => obj.invoiceId === invoice.invoiceId);
        if (objIndex > -1) {
          this.paymentInvoices.splice(objIndex, 1);
          this.paymentTotal = this.paymentTotal - invoice.balance;
        }
      }
    }
  }

  FilterChanged(e) {
    this.invoicesFilter = e.value;
    this.refreshInvoices();
  }

  monthSelected(e) {
    this.SetInvoiceFilter(e.month);
  }

  SetInvoiceFilter(month: Date) {
    if (month !== null) {
      if (this.selectedMonths.length === 0) {
        this.invoices = [];
      }
      this.selectedMonths.push(month);
      this.invoicesData.filter(f => f.billingMonth === month).forEach(i => {
        this.invoices.push(i);
      });
      return;
    }

    this.invoices = this.invoicesData;

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

    if (this.paymentInvoices.length === 0) {
      this.errorMessage = 'No Invoices Selected';
      return;
    }

    const paymentModel = {
      accountId: this.accountId,
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
      this.refreshInvoices();
    },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Payment Failed');
      });
  }

  public CloseClick() {
    this.mdDialogRef.close(true);
  }

}
