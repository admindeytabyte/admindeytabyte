import { InvoiceDialogComponent } from './../../shared/invoice-dialog/invoice-dialog.component';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { DxDataGridComponent } from 'devextreme-angular';
import { DatePipe } from '@angular/common';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { DataService } from '../../services/data.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-invoice-report',
  templateUrl: './invoice-report.component.html',
  styleUrls: ['./invoice-report.component.scss']
})
export class InvoiceReportComponent implements OnInit {
  @Input() selectedReport: any;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  dialogRef: MatDialogRef<InvoiceDialogComponent>;
  reportData: any[];
  startDate: any;
  endDate: any;
  gridHeight: number;
  user: any;
  constructor(
    private dataService: DataService,
    private userService: UserService,
    public datepipe: DatePipe,
    private dialog: MatDialog,
  ) {
    this.onResize();
    this.editInvoiceClick = this.editInvoiceClick.bind(this);
  }

  ngOnInit() {
    const currentDate = new Date();
    //this.startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    this.startDate = new Date();
    this.endDate = new Date();
    this.user = this.userService.getUser();
    this.refresh();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.gridHeight = window.innerHeight * .70;
  }

  refresh() {
    const startDate = this.datepipe.transform(this.startDate, 'MM/dd/yyyy');
    const endDate = this.datepipe.transform(this.endDate, 'MM/dd/yyyy');
    this.dataService.getInvoicesReport(startDate, endDate, this.user.companyId).subscribe(data => {
      this.reportData = data;
    });
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


  exportGrid(e) {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.dataGrid.instance
    }).then(() => {
      doc.save('Invoices.pdf');
    })
  }


}
