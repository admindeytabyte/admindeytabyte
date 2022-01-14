import { DatePipe } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-monthly-sales-report',
  templateUrl: './monthly-sales-report.component.html',
  styleUrls: ['./monthly-sales-report.component.scss']
})
export class MonthlySalesReportComponent implements OnInit {
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
    const currentDate = new Date();
    this.startDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1);
    this.endDate = new Date();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.gridHeight = window.innerHeight * .70;
  }

  refresh() {
    const startDate = this.datepipe.transform(this.startDate, 'MM/dd/yyyy');
    const endDate = this.datepipe.transform(this.endDate, 'MM/dd/yyyy');
    this.dataService.getSalesByMonthReport(startDate, endDate, this.user.companyId).subscribe(data => {
      this.reportData = data;
    });
  }


}
