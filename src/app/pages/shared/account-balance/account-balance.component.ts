import { DatePipe } from '@angular/common';
import { DataService } from './../../services/data.service';
import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-account-balance',
  templateUrl: './account-balance.component.html',
  styleUrls: ['./account-balance.component.scss']
})
export class AccountBalanceComponent implements OnInit, AfterViewInit {
  @Input() accountId: any;
  @Output() selectMonthEvent: EventEmitter<any> = new EventEmitter<any>();
  monthlyBalance: any[] = [];
  creditLimit = 0;
  currentBalance = 0;
  invoiceBalance = 0;
  estimateBalance = 0;
  creditAvailable = 0;
  constructor(
    private dataService: DataService,
    public datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.dataService.getReceivableSummary(this.accountId).subscribe(data => {
      this.monthlyBalance = [];
      this.creditLimit = data.creditLimit;
      this.currentBalance = data.totalBalance;
      this.creditAvailable = data.creditAvailable;
      this.invoiceBalance = data.invoiceBalance;
      this.estimateBalance = data.estimateBalance;
      data.monthlySummary.forEach(item => {
        const mb = {
          billingMonth: this.datepipe.transform(item.billingMonth, 'MMM-yy'),
          invoiceBalance: item.invoiceBalance,
          estimateBalance: item.estimateBalance,
          month: item.billingMonth
        };
        this.monthlyBalance.push(mb);
      });
    });
  }

  ngAfterViewInit() {
  }

  pointClick(e: any) {
    this.selectMonthEvent.emit(e.target.data);
  }

}
