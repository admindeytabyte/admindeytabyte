import { DataService } from './../../services/data.service';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { DxDataGridComponent } from 'devextreme-angular';
import { DatePipe } from '@angular/common';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sales-comm-report',
  templateUrl: './sales-comm-report.component.html',
  styleUrls: ['./sales-comm-report.component.scss']
})
export class SalesCommReportComponent implements OnInit {
  @Input() selectedReport: any;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  reportData: any[];
  reportDate: any;
  gridHeight: number;
  user: any;
  constructor(
    private dataService: DataService,
    private userService: UserService,
    public datepipe: DatePipe
  ) { this.onResize(); }

  ngOnInit() {
    const currentDate = new Date();
    this.reportDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    this.user = this.userService.getUser();
    this.refresh();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.gridHeight = window.innerHeight * .70;
  }

  onGridToolbarPreparing(e: { toolbarOptions: { items: any } }) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'print',
          onClick: this.exportGrid.bind(this)
        }
      },
    );
  }


  refresh() {
    const filterDate = this.datepipe.transform(this.reportDate, 'MM/dd/yyyy');
    this.dataService.getSalesCommReport(filterDate, this.user.companyId).subscribe(data => {
      this.reportData = data;
    });
  }

  dateChanged(e) {
    this.refresh();
  }

  exportGrid(e) {
    const doc = new jsPDF();
    exportDataGridToPdf({
      jsPDFDocument: doc,
      component: this.dataGrid.instance
    }).then(() => {
      doc.save('Customers.pdf');
    })
  }

}
