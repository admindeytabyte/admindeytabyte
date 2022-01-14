import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';
import 'jspdf-autotable';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-deposit-log-report',
  templateUrl: './deposit-log-report.component.html',
  styleUrls: ['./deposit-log-report.component.scss']
})
export class DepositLogReportComponent implements OnInit {
  user: any;
  repDate: any;
  repDateTxt: any;
  reportData: any[];

  constructor(
    private dataService: DataService,
    private userService: UserService,
    public datepipe: DatePipe,
    private mdDialogRef: MatDialogRef<DepositLogReportComponent>,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.repDate = new Date();
    this.repDateTxt = this.datepipe.transform(new Date(), 'yyyy-MMM-dd h:mm:ss a');
    this.refresh();
  }

  refresh() {
    const repDate = this.datepipe.transform(this.repDate, 'MM/dd/yyyy');
    
    this.dataService.getPaymentsReportByUser(repDate,this.user.id).subscribe(data => {
      this.reportData = data;
    });
  }

  public openPDF(): void {
    this.repDateTxt = this.datepipe.transform(new Date(), 'yyyy-MMM-dd h:mm:ss a');
    const options = {
      name: 'depositSlip.pdf',
      margin: 0.30,
      image: { type: 'jpeg', quality: 1 },
      filename: this.user.userId + '_Deposits_' + this.repDate + '.pdf',
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

  CloseClick(){
    this.mdDialogRef.close();
  }

}
