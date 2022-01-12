import { InvoiceMiniViewComponent } from './../../shared/invoice-mini-view/invoice-mini-view.component';
import { UserService } from './../../services/user.service';
import { WorkflowStat } from './../../shared/interfaces/workflowStat';
import { InvoiceDialogComponent } from './../../shared/invoice-dialog/invoice-dialog.component';
import { Component, OnInit, OnDestroy, HostListener, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../interfaces/app-state';
import { BasePageComponent } from '../../base-page/base-page.component';
import { DataService } from '../../services/data.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { DxDataGridComponent } from 'devextreme-angular';
import { Router } from '@angular/router';
import { ProductSaleDialogComponent } from '../../shared/product-sale-dialog/product-sale-dialog.component';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent extends BasePageComponent implements OnInit, OnDestroy {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  numDays = 7;
  invoices: any[];
  loadingVisible = false;
  invoicesData: any[];
  odStats: any[];
  workflowStats: WorkflowStat[] = [];
  invoiceStats: any[];
  invoiceDetails: any[];
  chartHeight = 0;
  invoiceGridHeight = 0;
  backOfficeGridHeight = 0;
  waitListedinvoices: any[];
  backOrderedinvoices: any[];
  screenHeight: number;
  screenWidth: number;
  timeLeft = 60;
  interval: any;
  dialogRef: MatDialogRef<InvoiceDialogComponent>;
  idialogRef: MatDialogRef<ProductSaleDialogComponent>;
  miniInvoicedialogRef: MatDialogRef<InvoiceMiniViewComponent>;
  user: any;

  constructor(
    store: Store<AppState>,
    private dataService: DataService,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router,
    public datepipe: DatePipe
  ) {
    super(store);
    this.pageData = {
      title: 'Dashboard Home',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Dashboards',
          route: './dashboard-home'
        },
        {
          title: 'Home'
        }
      ]
    };
    this.onResize();
    this.editInvoiceClick = this.editInvoiceClick.bind(this);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.chartHeight = this.screenHeight * .15;
    this.invoiceGridHeight = this.screenHeight * .77;
    this.backOfficeGridHeight = this.screenHeight * .25;
  }

  ngOnInit(): void {
    super.ngOnInit();
    // this.user = this.userService.getUser();
    // if (this.checkRole(69) === false) {
    //   this.router.navigateByUrl('/vertical/notallowed');
    //   return;
    // }
    this.refreshInvoices(true);
    this.startTimer();

    // this.dialogRef = this.dialog.open(InvoiceDialogComponent, {
    //   data: {
    //     invoiceId: 264784
    //   },
    //   height: '99%',
    //   width: '99%'
    // });

    // this.idialogRef = this.dialog.open(ProductSaleDialogComponent, {
    //   data: {
    //     partLinkId: 45848
    //   },
    //   height: '85%',
    //   width: '80%'
    // });

  }

  checkRole(roleId: any) {
    return this.userService.checkRole(roleId);
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 60;
        this.refreshInvoices(false);
      }
    }, 1000)
  }

  refreshInvoices(showLoader) {
    this.loadingVisible = showLoader;
    this.dataService.getHomePanelData(this.numDays, 1).subscribe(data => {
      this.loadingVisible = false;
      this.invoicesData = data.invoices;
      this.invoices = data.invoices;
      this.odStats = data.ordDeskStats;
      this.invoiceStats = data.invoiceStats;
      this.waitListedinvoices = this.invoicesData.filter(d => d.statusCde === 'W');
      this.backOrderedinvoices = this.invoicesData.filter(d => d.statusCde === 'B');
      this.workflowStats = [];
      data.workflowStats.forEach(item => {
        const dtl = new WorkflowStat({
          date: this.datepipe.transform(item.date, 'dd-MMM-yyyy'),
          invoiceCount: item.invoiceCount,
          status: item.status
        });
        this.workflowStats.push(dtl);
      });
    });
  }

  rowClicked(e) {
    this.dataService.getDetails(e.key).subscribe(data => {
      this.invoiceDetails = data;
    });
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxCheckBox',
        options: {
          width: 150,
          onValueChanged: this.applyQuoteFilter.bind(this),
          hint: 'Show Only Quotations',
          text: 'Quotations'
        }
      },
      {
        location: 'after',
        widget: 'dxNumberBox',
        options: {
          width: 80,
          min: '1',
          max: '90',
          showSpinButtons: true,
          value: '7',
          hint: 'Number Days to Look back Quotations',
          onValueChanged: this.numDays_valueChanged.bind(this)
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          hint: 'Refresh',
          onClick: this.refreshInvoices.bind(this)
        }
      });
  }

  numDays_valueChanged(e) {
    this.numDays = e.value;
    this.refreshInvoices(this.numDays);
  }

  applyQuoteFilter(e) {
    if (e.value === true) {
      this.dataGrid.instance.filter([
        ['Type', '=', 'Quotation']
      ]);
    } else {
      this.dataGrid.instance.clearFilter();
    }
  }

  onCellPrepared(e) {
    if (e.rowType === 'data' && e.column.dataField === 'total') {
      e.cellElement.style.color = e.data.total >= 0 ? 'green' : 'red';
    }

    if (e.rowType === 'data' && e.column.dataField === 'status') {
      switch (e.data.status) {
        case 'On Hold': {
          e.cellElement.style.color = 'maroon';
          break;
        }
      }
    }

    if (e.rowType === 'data' && e.column.dataField === 'client') {
      if (e.data.locked === true) {
        e.cellElement.style.color = 'white';
        e.cellElement.style.backgroundColor = 'maroon';
      }
    }

    if (e.rowType === 'data' && e.column.dataField === 'type') {
      switch (e.data.type) {
        case 'Invoice': {
          e.cellElement.style.color = 'navy';
          break;
        }
        case 'Estimate': {
          e.cellElement.style.color = '#f05b41';
          break;
        }
        case 'Quotation': {
          e.cellElement.style.color = 'maroon';
          break;
        }
      }
    }
  }

  OpenInvoice(e) {
    const selectedQuote = e.itemData;
    this.dialogRef = this.dialog.open(InvoiceDialogComponent, {
      data: {
        invoiceId: selectedQuote?.invoiceId
      },
      height: '99%',
      width: '99%'
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshInvoices(true);
      }
    });

  }

  workflowPointClicked(e) {
    this.invoices = null;
    this.invoices = this.invoicesData.filter(d => d.status === e.target._dataItem.data.status);
  }

  backOfficeflowPointClicked(e) {
    this.invoices = null;
    this.invoices = this.invoicesData.filter(d => d.status === e.target._dataItem.data.status);
  }

  getDetails(e) {
    return e.data.details;
  }

  editInvoiceClick(e) {
    this.dialogRef = this.dialog.open(InvoiceDialogComponent, {
      data: {
        invoiceId: e.row.data.invoiceId
      },
      height: '99%',
      width: '95%'
    });

    this.dialogRef.afterClosed().subscribe(result => {
      this.refreshInvoices(true);
    });

  }


  ngOnDestroy() {
    clearInterval(this.interval);
    super.ngOnDestroy();
  }

}
