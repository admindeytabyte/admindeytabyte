import { DatePipe } from '@angular/common';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { DxDataGridComponent } from 'devextreme-angular';



@Component({
  selector: 'app-payments-report',
  templateUrl: './payments-report.component.html',
  styleUrls: ['./payments-report.component.scss']
})
export class PaymentsReportComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @Input() selectedReport: any;
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
  ) { this.onResize(); }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.startDate = new Date();
    this.endDate = new Date();
    //this.startDate = new Date('2020-12-2');
    //this.endDate = new Date('2020-12-2');
    this.refresh();
  }

  onGridToolbarPreparing(e: { toolbarOptions: { items: any } }) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          width: 50,
          icon: 'exportpdf',
          onClick: this.exportGrid.bind(this)
        }
      });
  }


  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.gridHeight = window.innerHeight * .70;
  }

  getDetails(e) {
    return e.data.paymentDetails;
  }

  exportGrid(e) {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.dataGrid.instance
    }).then(() => {
      doc.save('payments.pdf');
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
