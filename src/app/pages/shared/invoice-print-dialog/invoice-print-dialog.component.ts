import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { jsPDF } from 'jspdf';
import * as html2pdf from 'html2pdf.js';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-invoice-print-dialog',
  templateUrl: './invoice-print-dialog.component.html',
  styleUrls: ['./invoice-print-dialog.component.scss']
})
export class InvoicePrintDialogComponent implements OnInit {
  @ViewChild('htmlData') htmlData: ElementRef;
  billingAddress: any;
  shippingAddress: any;
  logoUrl: any;
  header: any;
  isInvoice=false;
  details: any[] = [];
  balances: any[] = [];
  user: any;
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    invoice: any,
  },
    private dataService: DataService,
    private userService: UserService,
    private toastr: ToastrService,
    private mdDialogRef: MatDialogRef<InvoicePrintDialogComponent>,
    public datepipe: DatePipe) {
  }

  ngOnInit() {
    this.mdDialogRef.keydownEvents().subscribe(event => {
      if (event.key === "Escape") {
        this.CloseClick();
      }
    });
    this.isInvoice = this.data.invoice.invoiceTypeCde=='I';
    const companyId = this.data.invoice.companyId;
    this.user = this.userService.getUser();
    this.balances = this.data.invoice.balances;
    this.header = this.data.invoice.header;
    this.balances = [];
    this.data.invoice.balances.forEach(item => {
      const bal = {
        billingMonth: this.datepipe.transform(item.billingMonth, 'MMMM-yyyy'),
        billed: item.billed,
        paid: item.paid,
        balance: item.balance
      };
      this.balances.push(bal);
    });


    this.logoUrl = companyId === 4 ? 'assets/img/logo3P.png' : 'assets/img/iffylogo.jpg';
    this.details = this.data.invoice.details.sort((a, b) => a.sequenceId < b.sequenceId ? -1 : a.sequenceId > b.sequenceId ? 1 : 0)
    this.billingAddress = this.data.invoice.addresses.filter(f => f.addressTypeId === 1)[0];
    this.shippingAddress = this.data.invoice.deliveryModeId > 1
      ? this.data.invoice.addresses.filter(f => f.addressId === this.data.invoice.shippingId)[0] : this.billingAddress;
  }


  public printDoc() {
    const model = {
      invoiceId: this.data.invoice.invoiceId,
      note: 'Reprint',
      user: this.user.userId
    };

    this.dataService.printInvoice(model).subscribe(data => {
      this.toastr.success('Print Job Sent', this.user.company.companyName, { timeOut: 2000 });
    },
      (error) => {
        this.toastr.error('Invoice Print Failed');
      });
  }

  public openPDF(): void {

    const options = {
      name: 'invoice.pdf',
      margin: 0.20,
      image: { type: 'jpeg', quality: 1 },
      filename: this.data.invoice.invoiceNumber + '_' + this.data.invoice.fileName + '.pdf',
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      pdfCallback: this.pdfCallback
    }

    const elementToPrint = document.getElementById('htmlData');
    html2pdf().from(elementToPrint).set(options).save();

  }

  pdfCallback(pdfObject) {
    const number_of_pages = pdfObject.internal.getNumberOfPages()
    const pdf_pages = pdfObject.internal.pages
    const myFooter = 'Footer info'
    for (let i = 1; i < pdf_pages.length; i++) {
      // We are telling our pdfObject that we are now working on this page
      pdfObject.setPage(i)
      // The 10,200 value is only for A4 landscape. You need to define your own for other page sizes
      pdfObject.text(myFooter, 10, 200)
    }
  }

  public emailPDF(): void {
    const options = {
      name: 'invoice.pdf',
      margin: 0.20,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }

    const elementToPrint = document.getElementById('htmlData');
    const doc = html2pdf().from(elementToPrint).set(options).save();

  }

  CloseClick() {
    this.close(true);
  }

  printPage() {
    window.print();
  }

  public close(value) {
    this.mdDialogRef.close(value);
  }


}
