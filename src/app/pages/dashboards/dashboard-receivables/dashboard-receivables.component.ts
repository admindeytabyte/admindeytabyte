import { ClientContactEditorComponent } from './../../shared/client-contact-editor/client-contact-editor.component';
import { Router } from '@angular/router';
import { NotesDialogComponent } from './../../shared/notes-dialog/notes-dialog.component';
import { UserService } from './../../services/user.service';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../interfaces/app-state';
import { BasePageComponent } from '../../base-page/base-page.component';
import { DataService } from '../../services/data.service';
import { DatePipe } from '@angular/common';
import { DxPivotGridComponent } from 'devextreme-angular';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
// tslint:disable-next-line: import-spacing
//  import *  as  data from './rec.json';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InvoiceDialogComponent } from '../../shared/invoice-dialog/invoice-dialog.component';
import { PaymentDialogComponent } from '../../shared/payment-dialog/payment-dialog.component';
import { CommonEditorDialogComponent } from '../../shared/common-editor-dialog/common-editor-dialog.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dashboard-receivables',
  templateUrl: './dashboard-receivables.component.html',
  styleUrls: ['./dashboard-receivables.component.scss']
})
export class DashboardReceivablesComponent extends BasePageComponent implements OnInit, OnDestroy {
  @ViewChild(DxPivotGridComponent, { static: false }) pivotGrid: DxPivotGridComponent;
  screenHeight: number;
  screenWidth: number;
  gridHeight: number;
  accountId: any;
  startDate: any;
  loadingVisible = false;
  pivotGridHeight = 0;
  yearlySummary: any[] = [];
  monthlyChartData: any[] = [];
  MonthlySummary: any[] = [];
  details: any[] = [];
  recData: any[] = [];
  gridCaption = 'Details for past Year';
  clientCaption: string;
  recGridDataSource: PivotGridDataSource;
  user: any;
  client: any;
  clientNotes: any[];
  notesDialogRef: MatDialogRef<NotesDialogComponent>;
  contactsDialogRef: MatDialogRef<ClientContactEditorComponent>;
  invoicesDialogRef: MatDialogRef<InvoiceDialogComponent>;
  clientPaymentDialogRef: MatDialogRef<PaymentDialogComponent>;
  clientDialogRef: MatDialogRef<CommonEditorDialogComponent>;
  confDialogRef: MatDialogRef<ConfirmDialogComponent>;
  clientContacts: any[];
  clientPayments: any[];
  clientInvoices: any[];

  constructor(
    private dataService: DataService,
    public datepipe: DatePipe,
    private userService: UserService,
    private router: Router,
    store: Store<AppState>,
    private dialog: MatDialog
  ) {
    super(store);
    this.pageData = {
      title: 'Receivables',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Receivables',
          route: './dashboard-receivables'
        }
      ]
    };
    this.onResize();
    this.editInvoiceClick = this.editInvoiceClick.bind(this);
    this.payInvoiceClick = this.payInvoiceClick.bind(this);
    this.collectionsClick = this.collectionsClick.bind(this);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.gridHeight = this.screenHeight * .50;
    this.pivotGridHeight = this.screenHeight * .70;
  }

  ngOnInit() {
    super.ngOnInit();
    this.user = this.userService.getUser();
    if (this.checkRole(35) === false) {
      this.router.navigateByUrl('/vertical/notallowed');
      return;
    }
    const currentDate = new Date();
    this.startDate = new Date(currentDate.getFullYear() - 4, 0, 1);
    this.refreshReceivablesData();
  }

  checkRole(roleId: any) {
    return this.userService.checkRole(roleId);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }


  refreshReceivablesData() {
    this.loadingVisible = true;
    // tslint:disable-next-line: no-shadowed-variable
    this.dataService.getReceivablesDashData(this.datepipe.transform(this.startDate, 'MM/dd/yyyy'), this.user.companyId).subscribe(data => {
      this.loadingVisible = false;
      this.yearlySummary = data.yearlySummary;
      this.recData = data.monthlyDetails;
      this.monthlyChartData = data.monthlySummary;
      this.refreshRecGrid(this.recData);
      this.refreshChart(0);
    });
  }

  yearClicked(e) {
    this.refreshChart(e.target.data.year);
    this.refreshRecGrid(this.recData.filter(f => f.year === e.target.data.year));
    this.gridCaption = 'Details for ' + e.target.data.year;
  }

  monthClicked(e) {
    this.gridCaption = 'Details for ' + this.datepipe.transform(e.target.data.billingMonth, 'MMM-yyyy');
    this.refreshRecGrid(this.recData.filter(f => f.billingMonth === e.target.data.billingMonth));
  }

  refreshChart(year: any) {
    this.MonthlySummary = [];
    const chartData = year > 0
      ? this.monthlyChartData.filter(f => f.year === year)
      : this.monthlyChartData.slice(0, 12);

    chartData.forEach(item => {
      const mb = {
        billingMonth: item.month,
        month: this.datepipe.transform(item.month, 'MMM-yy'),
        originalBalance: item.originalBalance,
        currentBalance: item.currentBalance,
        efficiency: item.originalBalance > 0 ? (1 - (item.currentBalance / item.originalBalance)) * 100 : 0
      };
      this.MonthlySummary.push(mb);
    });
  }

  customizeLabel(arg: any) {
    if (arg.seriesName === 'Orig. Bal($)') {
      return {
        customizeText: function (e: any) {
          return e.valueText + ' (' + arg.data.efficiency.toFixed(2) + '%)';
        }
      };
    }
    return null;
  }


  refreshRecGrid(data: any) {
    this.recGridDataSource = new PivotGridDataSource({
      fields: [
        {
          caption: 'Client',
          dataField: 'client',
          area: 'row',
          sortBySummaryField: 'currentBalance',
          sortOrder: 'desc'
        },
        {
          dataField: 'billingMonth',
          dataType: 'date',
          area: 'row',
          sortOrder: 'desc',
          groupName: 'Date'
        },
        { groupName: 'Date', groupInterval: 'year', groupIndex: 0 },
        { groupName: 'Date', groupInterval: 'month', groupIndex: 1 },
        {
          caption: 'Balance ($)',
          dataField: 'currentBalance',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
          sortOrder: 'desc'
        }
      ],
      store: data
    });

  }

  clientCellClicked(e) {
    const account = this.recData.filter(i => i.client === e.cell.text)[0];
    if (account !== undefined) {
      this.accountId = account.accountId;
      this.dataService.getReceivablesClient(this.accountId).subscribe(data1 => {
        this.client = data1.client;
        this.clientCaption = this.client.companyName + '($' + this.client.creditLimit.toFixed(2) + ')';
        this.clientNotes = data1.clientNotes;
        this.clientContacts = data1.clientContacts;
        this.clientPayments = data1.clientPayments;
      });

      this.dataService.getClientInvoices(this.accountId, true).subscribe(data => {
        //this.clientInvoices = data.filter(item => item.invoiceTypeCde !== 'Q' && item.balance !== 0);
        this.clientInvoices = data;
      });
    }
  }

  payInvoiceClick(e) {
    this.clientPaymentDialogRef = this.dialog.open(PaymentDialogComponent, {
      data: {
        accountId: this.accountId,
        invoiceId: e.row.data.invoiceId
      },
      height: '40%',
      width: '50%',
      panelClass: 'my-dialog'
    });

    this.clientPaymentDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.getClientInvoices(this.accountId, true).subscribe(data => {
          //this.clientInvoices = data.filter(item => item.invoiceTypeCde !== 'Q' && item.balance !== 0);
          this.clientInvoices = data;
        });
      }
    });

  }

  collectionsClick(e) {

    this.confDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Collection',
        message: 'Do you want to mark the Invoice ' + e.row.data.invoiceNumber + ' for Collections?'
      }, height: '200px', width: '600px', panelClass: 'my-dialog'
    });

    const sub = this.confDialogRef.componentInstance.confirmEvent.subscribe((data) => {
      if (data === true) {
        // Send Invoice for Collections
        const model = {
          invoiceId: e.row.data.invoiceId,
          loggedBy: this.user.userId,
          loggedById: this.user.id
        }

        this.dataService.logCollection(model).subscribe(data => {
          this.dataService.getClientInvoices(this.accountId, true).subscribe(data => {
            this.clientInvoices = data;
          });
        },
          (error) => {
          });
      }
    });

    this.confDialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });

  }

  onNotesGridToolbarPreparing(e: { toolbarOptions: { items: any } }) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        width: 250,
        widget: 'dxButton',
        options: {
          text: 'Edit Notes',
          onClick: this.manageNotes.bind(this)
        }
      },
    );
  }

  onContactsGridToolbarPreparing(e: { toolbarOptions: { items: any } }) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        width: 250,
        widget: 'dxButton',
        options: {
          text: 'Edit Contacts',
          onClick: this.manageContacts.bind(this)
        }
      },
    );
  }

  onPaymentsGridToolbarPreparing(e: { toolbarOptions: { items: any } }) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        width: 250,
        widget: 'dxButton',
        options: {
          text: 'Edit Payments',
          onClick: this.managePayments.bind(this)
        }
      },
    );
  }

  editInvoiceClick(e) {
    this.invoicesDialogRef = this.dialog.open(InvoiceDialogComponent, {
      data: {
        invoiceId: e.row.data.invoiceId
      },
      height: '99%',
      width: '95%'
    });
  }

  manageNotes() {
    this.notesDialogRef = this.dialog.open(NotesDialogComponent, {
      data: {
        accountId: this.accountId
      },
      height: '800px',
      width: '1000px',
      panelClass: 'my-dialog'
    });
  }

  manageContacts() {
    this.contactsDialogRef = this.dialog.open(ClientContactEditorComponent, {
      data: {
        accountId: this.accountId
      },
      height: '800px',
      width: '1000px',
      panelClass: 'my-dialog'
    });
  }

  managePayments() {
    this.clientDialogRef = this.dialog.open(CommonEditorDialogComponent, {
      data: {
        editorType: 'clientInvoicePayments',
        client: this.client
      },
      height: (this.screenHeight * .80) + 'px',
      width: (this.screenWidth * .80) + 'px',
      panelClass: 'my-dialog'
    });
  }

  onCellPrepared({ cell, area, cellElement }) {
    cell.area = area;
    if (cell.area === 'row') {
      Object.assign(cellElement.style, this.getCssStyles());
    }
  }

  getCssStyles() {
    return {
      color: 'navy',
      'font-weight': 'bold',
      'font-size': '14'
    };
  }

}
