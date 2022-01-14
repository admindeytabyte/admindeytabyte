import { DatePipe } from '@angular/common';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { DxDataGridComponent } from 'devextreme-angular';
import * as html2pdf from 'html2pdf.js';
import { AccountBalanceComponent } from '../../shared/account-balance/account-balance.component';
import { CommonEditorDialogComponent } from '../../shared/common-editor-dialog/common-editor-dialog.component';
import { NotesDialogComponent } from '../../shared/notes-dialog/notes-dialog.component';

@Component({
  selector: 'app-statements-report',
  templateUrl: './statements-report.component.html',
  styleUrls: ['./statements-report.component.scss']
})
export class StatementsReportComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild(AccountBalanceComponent) balances: AccountBalanceComponent;
  @Input() selectedReport: any;
  reportData: any[];
  statements: any[];
  summary: any[];
  invoices: any[];
  startDate: any;
  endDate: any;
  gridHeight: number;
  statementDate: any;
  billingAddress: any;
  user: any;
  customers: any[];
  selectedAccount: any;
  accountId = 0;
  reportTitle: any;
  months: any[];
  header: any;
  logoUrl: string;
  selectedMonth: any;
  invoicesCount = 0;
  grossTotal = 0;
  taxTotal = 0;
  billedTotal = 0;
  paidTotal = 0;
  balanceTotal = 0;
  grossSummary = 0;
  taxSummary = 0;
  billedSummary = 0;
  paidSummary = 0;
  balanceSummary = 0;
  invoiceTitle: any;
  summaryTitle: any;
  summaryAlert: any;
  loadingVisible = false;
  companyName: any;
  clientDialogRef: MatDialogRef<CommonEditorDialogComponent>;
  notesDialogRef: MatDialogRef<NotesDialogComponent>;
  constructor(
    private dataService: DataService,
    private userService: UserService,
    public datepipe: DatePipe,
    private dialog: MatDialog,
  ) { this.onResize(); }

  ngOnInit() {
    this.user = this.userService.getUser();
    //this.startDate = new Date('2020-12-2');
    //this.endDate = new Date('2021-1-1');
    this.reportTitle = "Statements";
    this.statementDate = this.datepipe.transform(new Date(), 'dd-MMM-yyyy');
    this.logoUrl = this.user.companyId === 4 ? 'assets/img/logo3P.png' : 'assets/img/iffylogo.jpg';

    this.dataService.getClientsForStatements(this.user.companyId).subscribe(data => {
      this.customers = data;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.gridHeight = window.innerHeight * .70;
  }

  formatCurrency(value: number){
    return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); 
  }

  openContacts() {
    console.log('Notes');
    if (this.selectedAccount === undefined || this.selectedAccount === null) {
      alert('Please Select a Client');
      return;
    }
    this.clientDialogRef = this.dialog.open(CommonEditorDialogComponent, {
      data: {
        editorType: 'clientContacts',
        client: this.selectedAccount
      },
      height: '70%',
      width: '60%',
      panelClass: 'my-dialog'
    });
  }

  openNotes() {
    if (this.selectedAccount === undefined || this.selectedAccount === null) {
      alert('Please Select a Client');
      return;
    }
    this.notesDialogRef = this.dialog.open(NotesDialogComponent, {
      data: {
        accountId: this.selectedAccount.accountId
      },
      height: '70%',
      width: '60%',
      panelClass: 'my-dialog'
    });
  }
  

  listSelectionChanged = (e) => {
    this.selectedAccount = e.addedItems[0];
    this.accountId = e.addedItems[0].accountId;
    this.reportTitle = "Statements for " + this.selectedAccount.companyName;
    this.dataService.getStatementMonths(this.selectedAccount.accountId).subscribe(data => {
      this.months = data;
      if (this.selectedMonth == null || this.selectedMonth == undefined){
        this.selectedMonth = data[0];
      }
      this.balances.accountId = this.accountId;
      this.balances.refresh();
      if (this.selectedMonth != null) {
        this.generateStatement();
      }
    });

  };

  statementMonthChanged(e) {
    this.selectedMonth = e.value;
    this.generateStatement();
  }

  generateStatement() {
    this.invoicesCount = 0;
    this.grossTotal = 0;
    this.taxTotal = 0;
    this.billedTotal = 0;
    this.paidTotal = 0;
    this.balanceTotal = 0;
    this.grossSummary = 0;
    this.taxSummary = 0;
    this.billedSummary = 0;
    this.paidSummary = 0;
    this.balanceSummary = 0;
    this.loadingVisible = true;
    this.dataService.getStatement(this.selectedAccount.accountId, this.selectedMonth, this.user.companyId).subscribe(data => {
      this.loadingVisible = false;
      this.companyName = data.companyName != null ? data.companyName : this.selectedAccount.companyName;
      this.invoiceTitle = data.companyName + ' Statement for Month of ' + this.selectedMonth;
      this.summaryTitle = data.monthLag > 0 ? 'Balances Summary as end of ' + this.selectedMonth : 'Current Balance Summary (' + this.statementDate + ')';
      this.summaryAlert = data.monthLag > 0 ? 'Note: Payments made after month end ' +  this.selectedMonth + ' are not included in the summary below' : null;
      this.statements = data;
      this.invoices = data.invoices;
      this.summary = data.summary;
      this.header = data.header;
      this.billingAddress = data.billingAddress;
      this.calcTotals();
    });
  }

  calcTotals() {
    this.invoicesCount = this.invoices.length;
    this.invoices.forEach(dtl => this.grossTotal += (dtl.gross));
    this.invoices.forEach(dtl => this.taxTotal += (dtl.gst));
    this.invoices.forEach(dtl => this.billedTotal += (dtl.netAmount));
    this.invoices.forEach(dtl => this.paidTotal += (dtl.payment));
    this.invoices.forEach(dtl => this.balanceTotal += (dtl.balance));
    this.summary.forEach(dtl => this.grossSummary += (dtl.gross));
    this.summary.forEach(dtl => this.taxSummary += (dtl.tax));
    this.summary.forEach(dtl => this.billedSummary += (dtl.billed));
    this.summary.forEach(dtl => this.paidSummary += (dtl.paid));
    this.summary.forEach(dtl => this.balanceSummary += (dtl.balance));
  }

  public openPDF(): void {

    const options = {
      name: 'statement.pdf',
      margin: 0.20,
      image: { type: 'jpeg', quality: 1 },
      filename: this.selectedAccount.companyName + '_' + this.statementDate + '.pdf',
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

  exportGrid() {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.dataGrid.instance
    }).then(() => {
      doc.save('statement.pdf');
    })
  }

  refresh() {
    const startDate = this.datepipe.transform(this.startDate, 'MM/dd/yyyy');
    const endDate = this.datepipe.transform(this.endDate, 'MM/dd/yyyy');
    this.dataService.getPaymentsReport(startDate, endDate, this.user.companyId).subscribe(data => {
      this.reportData = data;
    });
  }


}
