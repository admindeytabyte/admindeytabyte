import { DatePipe } from '@angular/common';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DxDataGridComponent } from 'devextreme-angular';
import jsPDF from 'jspdf';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';
import { InvoiceDialogComponent } from '../../shared/invoice-dialog/invoice-dialog.component';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';

@Component({
  selector: 'app-sales-byline-report',
  templateUrl: './sales-byline-report.component.html',
  styleUrls: ['./sales-byline-report.component.scss']
})
export class SalesBylineReportComponent implements OnInit {

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
  }

  ngOnInit() {
    const currentDate = new Date();
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
    this.dataService.getSalesByLineReport(startDate, endDate, this.user.companyId).subscribe(data => {
      this.reportData = data;
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
