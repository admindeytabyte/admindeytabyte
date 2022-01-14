import { DatePipe } from '@angular/common';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DxDataGridComponent } from 'devextreme-angular';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';
import { InvoiceDialogComponent } from '../../shared/invoice-dialog/invoice-dialog.component';

@Component({
  selector: 'app-dispatch-log-report',
  templateUrl: './dispatch-log-report.component.html',
  styleUrls: ['./dispatch-log-report.component.scss']
})
export class DispatchLogReportComponent implements OnInit {
  @Input() selectedReport: any;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  dialogRef: MatDialogRef<InvoiceDialogComponent>;
  reportData: any[];
  reportDate: any;
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
    //this.editInvoiceClick = this.editInvoiceClick.bind(this);
  }

  ngOnInit() {
    const currentDate = new Date();
    //this.startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    this.reportDate = new Date();
    this.user = this.userService.getUser();
  }

  refresh() {
    const reportDate = this.datepipe.transform(this.reportDate, 'MM/dd/yyyy');
    // this.dataService.getInvoicesReport(reportDate, this.user.companyId).subscribe(data => {
    //   this.reportData = data;
    // });
  }

  editInvoiceClick(){
    
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.gridHeight = window.innerHeight * .70;
  }

}
