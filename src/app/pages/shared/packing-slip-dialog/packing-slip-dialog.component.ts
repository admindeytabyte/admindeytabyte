import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { jsPDF } from 'jspdf';
import * as html2pdf from 'html2pdf.js';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-packing-slip-dialog',
  templateUrl: './packing-slip-dialog.component.html',
  styleUrls: ['./packing-slip-dialog.component.scss']
})
export class PackingSlipDialogComponent implements OnInit {
  @ViewChild('htmlData') htmlData: ElementRef;
  billingAddress: any;
  shippingAddress: any;
  contact: any;
  logoUrl: any;
  header: any;
  details: any[] = [];
  invoice: any;
  user: any;
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    invoiceId: any
  },
    private dataService: DataService,
    private userService: UserService,
    private mdDialogRef: MatDialogRef<PackingSlipDialogComponent>,
    public datepipe: DatePipe) {
  }

  ngOnInit() {
    this.mdDialogRef.keydownEvents().subscribe(event => {
      if (event.key === "Escape") {
        this.CloseClick();
      }
    });
    this.user = this.userService.getUser();
    const companyId = this.user.companyId;
    this.logoUrl = companyId === 4 ? 'assets/img/logo3P.png' : 'assets/img/iffylogo.jpg';


    this.dataService.getInvoice(this.data.invoiceId).subscribe(data => {
      this.invoice = data;
      this.header = this.invoice.header;
      this.details = this.invoice.details.sort((a, b) => a.sequenceId < b.sequenceId ? -1 : a.sequenceId > b.sequenceId ? 1 : 0)
      this.billingAddress = this.invoice.addresses.filter(f => f.addressTypeId === 1)[0];
      this.shippingAddress = this.invoice.addresses.filter(f => f.addressId === this.invoice.shippingId)[0];
      if (this.invoice.orderedContact !== null) {
        this.contact = this.invoice.orderedContact;
      }
      else {
        this.contact = {
          fullName: this.invoice.orderedBy,
          phone: this.billingAddress.phoneLine1,
          email: 'n/a'
        }
      }
    });
  }

  public openPDF(): void {

    const options = {
      name: 'packingslip.pdf',
      margin: 0.20,
      image: { type: 'jpeg', quality: 1 },
      filename: this.invoice.invoiceNumber + '_' + this.invoice.fileName + '_ps.pdf',
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
