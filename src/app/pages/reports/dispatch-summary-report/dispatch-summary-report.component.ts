import { DatePipe } from '@angular/common';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DxDataGridComponent } from 'devextreme-angular';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';
import { InvoiceDialogComponent } from '../../shared/invoice-dialog/invoice-dialog.component';
import jsPDF from 'jspdf';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';

@Component({
  selector: 'app-dispatch-summary-report',
  templateUrl: './dispatch-summary-report.component.html',
  styleUrls: ['./dispatch-summary-report.component.scss']
})
export class DispatchSummaryReportComponent implements OnInit {
  @Input() selectedReport: any;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  dialogRef: MatDialogRef<InvoiceDialogComponent>;
  reportData: any[];
  reportDate: any;
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
    this.reportDate = new Date();
    this.user = this.userService.getUser();
    this.refresh();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.gridHeight = window.innerHeight * .70;
  }

  refresh() {
    const reportDate = this.datepipe.transform(this.reportDate, 'MM/dd/yyyy');
    this.dataService.getDispatchSummaryReport(reportDate, this.user.companyId).subscribe(data => {
      this.reportData = data;
    });
  }

  exportGrid(e) {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.dataGrid.instance
    }).then(() => {
      doc.save('DispatchSummary.pdf');
    })
  }


}
