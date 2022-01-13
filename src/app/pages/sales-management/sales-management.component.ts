import { DatePipe } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BasePageComponent } from '../base-page/base-page.component';
import { DataService } from '../services/data.service';
import { UserService } from '../services/user.service';
import { ClientCommissionsDialogComponent } from '../shared/client-commissions-dialog/client-commissions-dialog.component';
import { categorySummary } from '../shared/interfaces/categorySummary';
import { InvoiceMiniViewComponent } from '../shared/invoice-mini-view/invoice-mini-view.component';
import { SalesDialogComponent } from '../shared/sales-dialog/sales-dialog.component';
import { AppState } from './../../interfaces/app-state';

@Component({
  selector: 'app-sales-management',
  templateUrl: './sales-management.component.html',
  styleUrls: ['./sales-management.component.scss']
})
export class SalesManagementComponent extends BasePageComponent implements OnInit, OnDestroy {
  user: any;
  monthlySummary: any[] = [];
  categorySummary: categorySummary[] = [];
  invoices: any[];
  customers: any[];
  commissions: any[];
  screenHeight: number;
  screenWidth: number;
  gridHeight: number;
  cities: any[];
  provinces: any[];
  countries: any[];
  zones: any[];
  chargeTypes: any[];
  paymentTypes: any[];
  isAdmin: boolean=false;
  salesPeople: any[];
  selectedMonth: Date;
  catChartTile: string = 'Sales By Category';
  selectedSalesPerson: any;
  miniInvoicedialogRef: MatDialogRef<InvoiceMiniViewComponent>;
  commishDialogRef: MatDialogRef<ClientCommissionsDialogComponent>;
  salesDialogRef: MatDialogRef<SalesDialogComponent>;
  
  phoneRules: any = {
    X: /[02-9]/
  }
  salesCategoryData: any[];
  startDate: any;
  selectedAccount: any;
  
  constructor(
    store: Store<AppState>,
    private userService: UserService,
    private dataService: DataService,
    private dialog: MatDialog,
    public datepipe: DatePipe) {
    super(store);
    this.pageData = {
      title: 'Sales Management',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Sales Management',
          route: 'salesmanagement'
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
    this.gridHeight = this.screenHeight * .55;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.user = this.userService.getUser();
    this.isAdmin = this.user.isAdmin;
    this.startDate = new Date(new Date().getFullYear(), new Date().getMonth()-6, 1);
    this.refreshDashboard();
    this.getStatics();
  }

  checkRole(roleId: any) {
    return this.userService.checkRole(roleId);
  }

  customerFocusChanged(e) {
    this.selectedAccount = e.row.data;
  }

  

  getStatics() {
    this.dataService.getStatics(this.user.companyId).subscribe(data => {
      this.provinces = data.provinces;
      this.zones = data.zones;
      this.chargeTypes = data.chargeTypes;
      this.paymentTypes = data.paymentTypes;
      this.salesPeople = this.user.isAdmin ? data.salesPeople : data.salesPeople.filter(c => c.salesPersonId === this.user.salesPersonId) ;
      this.countries = data.countries;
      this.cities = data.cities;
      //Set Default
      this.selectedSalesPerson = this.user.isAdmin ? null : data.salesPeople.filter(c => c.salesPersonId === this.user.salesPersonId)[0];
    });
  }

  onclientGridToolbarPreparing(e: { toolbarOptions: { items: any } }) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'money',
          hint: 'Commissions',
          onClick: this.openCommissions.bind(this)
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'chart',
          hint: 'Sales Analysis',
          onClick: this.showSales.bind(this)
        }
      }
    
    );
      
  }

  onCellPrepared(e) {
    if (e.rowType === 'data' && e.column.dataField === 'total') {
      e.cellElement.style.color = e.data.total >= 0 ? 'green' : 'red';
    }

    if (e.rowType === 'data' && e.column.dataField === 'payment') {
      e.cellElement.style.color = e.data.total >= 0 ? 'green' : 'red';
    }

    if (e.rowType === 'data' && e.column.dataField === 'balance') {
      e.cellElement.style.color = e.data.total < 0 ? 'green' : 'red';
    }

    
  }


  refreshDashboard() {
    if (this.selectedSalesPerson === null || this.selectedSalesPerson === undefined){
      return;
    }
    this.dataService.getSalesManagementDash(this.selectedSalesPerson.salesPersonId, this.datepipe.transform(this.startDate, 'MM/dd/yyyy')).subscribe(data => {
      //Monthly Summary
      this.monthlySummary = [];
      data.salesMonthlySummary.forEach(item => {
        const dtl = {
           month : this.datepipe.transform(item.month, 'dd-MMM-yyyy'),
           amount: item.salesAmount,
        };
        this.monthlySummary.push(dtl);
      });
      this.invoices= data.invoices;
      this.customers = data.customers;
      this.salesCategoryData = data.salesCategorySummary; 
      this.commissions = data.commissionSummary;
      //Category Summary
     this.buildCategorySumary(data.salesCategorySummary);
     this.catChartTile = 'Sales by Category from ' + this.datepipe.transform(this.startDate, 'dd-MMM-yyyy');
    });
  }

  buildCategorySumary(data: any[]){
    const catArray: categorySummary[]=[];
    data.forEach(item => {
      //Check if Item Exists
      const check = catArray.filter(c => c.category === item.categoryName);

        if (check.length  === 0){
          const cat = new categorySummary({
            category : item.categoryName,
            amount: item.salesAmount
         });
         catArray.push(cat);
        }
        else{
          check[0].amount += item.salesAmount;
        }
    });
    this.categorySummary = [];
    catArray.sort((a, b) => {
      return b.amount - a.amount;
    });
    this.categorySummary = catArray.slice(0, 25);
  }

  editInvoiceClick(e) {
    this.miniInvoicedialogRef = this.dialog.open(InvoiceMiniViewComponent, {
      data: {
        invoiceId: e.row.data.invoiceId
      },
      height: '60%',
      width: '50%'
    });
  }

  openCommissions() {
    if (this.selectedAccount === undefined || this.selectedAccount === null) {
      alert('Please Select a Client');
      return;
    }
    this.commishDialogRef = this.dialog.open(ClientCommissionsDialogComponent, {
      data: {
        accountId: this.selectedAccount.accountId
      },
      height: (this.screenHeight * .50) + 'px',
      width: (this.screenWidth * .40) + 'px',
      panelClass: 'my-dialog'
    });
  }

  showSales(e) {
    this.salesDialogRef = this.dialog.open(SalesDialogComponent, {
      data: {
        accountId:this.selectedAccount.accountId
      },
      height: '70%',
      width: '60%'
    });
  }

  monthClicked(e) {
    const month = this.datepipe.transform(e.target.data.month, 'yyyy-MM-ddT00:00:00');
    this.buildCategorySumary(this.salesCategoryData.filter(c => c.month === month));
    this.catChartTile = 'Sales by Category for ' + this.datepipe.transform(month, 'dd-MMM-yyyy');
  }

}
