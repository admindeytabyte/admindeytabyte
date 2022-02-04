import { DatePipe } from '@angular/common';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import * as html2pdf from 'html2pdf.js';
import 'jspdf-autotable';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-payments-summary-report',
  templateUrl: './payments-summary-report.component.html',
  styleUrls: ['./payments-summary-report.component.scss']
})
export class PaymentsSummaryReportComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @Input() selectedReport: any;
  loadingVisible = false;
  selectedAccount: any;
  accountId: any;
  header: any;
  reportTitle: string;
  user: any;
  reportDate: string;
  customers: any[];
  gridHeight: number;
  companyName: any;
  billingAddress: any;
  logoUrl: string;

  constructor(private dataService: DataService,
    private userService: UserService,
    public datepipe: DatePipe,
    private dialog: MatDialog,) { }
    reportData: any[];
    startDate: any;
    endDate: any;

    @HostListener('window:resize', ['$event'])
    onResize(event?) {
    this.gridHeight = window.innerHeight * .60;
  }

    ngOnInit() {
      this.gridHeight = window.innerHeight * .60;
      this.user = this.userService.getUser();
      const currentDate = new Date();
      this.startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      this.endDate = new Date();
      this.reportTitle = "Payments Summary";
      this.reportDate = this.datepipe.transform(new Date(), 'dd-MMM-yyyy');
      this.logoUrl = this.user.companyId === 4 ? 'assets/img/logo3P.png' : 'assets/img/iffylogo.jpg';
  
      this.dataService.getClients(this.user.companyId, false, false).subscribe(data => {
        this.customers = data;
      });
    }

    onGridToolbarPreparing(e: { toolbarOptions: { items: any } }) {
      e.toolbarOptions.items.unshift(
        {
          location: 'after',
          widget: 'dxButton',
          options: {
            width: 50,
            icon: 'exportpdf',
            onClick: this.openPDF.bind(this)
          }
        });
    }

    exportGrid(e) {
      // const doc = new jsPDF();
      // exportDataGridToPdf({
      //   jsPDFDocument: doc,
      //   component: this.dataGrid.instance
      // }).then(() => {
      //   doc.save("PaymentSummaryFor_" + this.companyName + "_.pdf");
      // })
    }

    public openPDF(): void {

      const options = {
        name: 'statement.pdf',
        margin: 0.20,
        image: { type: 'jpeg', quality: 1 },
        filename: 'Payment Summary_' + this.selectedAccount.companyName + '_'  + '.pdf',
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
  

  listSelectionChanged = (e) => {
    this.selectedAccount = e.addedItems[0];
    this.accountId = e.addedItems[0].accountId;
    this.reportTitle = "Payment Summary for " + this.selectedAccount.companyName;
    this.companyName = this.selectedAccount.companyName;
    this.refresh();
  };

  refresh(){
    const startDate = this.datepipe.transform(this.startDate, 'MM/dd/yyyy');
    const endDate = this.datepipe.transform(this.endDate, 'MM/dd/yyyy');
    this.dataService.getClientPaymentsReport(this.accountId, startDate, endDate, this.user.companyId).subscribe(data => {
      this.header = data.header;
      this.reportData = data.payments;
      this.companyName = data.companyName != null ? data.companyName : this.selectedAccount.companyName;
      this.billingAddress = data.billingAddress;
    });
  }

  

}
