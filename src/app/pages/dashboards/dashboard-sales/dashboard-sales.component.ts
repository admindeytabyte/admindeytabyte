import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../interfaces/app-state';
import { BasePageComponent } from '../../base-page/base-page.component';
import { DataService } from '../../services/data.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { DxPivotGridComponent } from 'devextreme-angular';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';


@Component({
  selector: 'app-dashboard-sales',
  templateUrl: './dashboard-sales.component.html',
  styleUrls: ['./dashboard-sales.component.scss']
})
export class DashboardSalesComponent extends BasePageComponent implements OnInit, OnDestroy {
  @ViewChild(DxPivotGridComponent, { static: false }) pivotGrid: DxPivotGridComponent;
  salesGridDataSource: PivotGridDataSource;
  custSalesGridDataSource: PivotGridDataSource;
  screenHeight: number;
  screenWidth: number;
  gridHeight = 0;
  pivotGridHeight = 0;
  loadingVisible = false;
  salesData: any[] = [];
  yearlySummary: any[] = [];
  MonthlySummary: any[] = [];
  categorySummary1: any[] = [];
  categorySummary2: any[] = [];
  categorySummary: any[] = [];
  clientSummary1: any[] = [];
  clientSummary2: any[] = [];
  clientSummary: any[] = [];
  clientFilterTypes: any[] = [];
  clientFilterType: any;
  startDate: any;
  endDate: any;
  monthToCompare = 1;
  primarymonth = 0;
  month1: any;
  month2: any;
  snapShot = false;
  user: any;

  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private userService: UserService,
    private router: Router,
    store: Store<AppState>,
  ) {
    super(store);
    this.pageData = {
      title: 'Dashboard Home',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Dashboards',
          route: './dashboard-sales'
        },
        {
          title: 'Sales'
        }
      ]
    };
    this.onResize();
    this.user = this.userService.getUser();
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (this.checkRole(65) === false) {
      this.router.navigateByUrl('/vertical/notallowed');
      return;
    }
    this.startDate = new Date();
    this.startDate.setFullYear(this.startDate.getFullYear() - 4);
    this.endDate = new Date();
    this.startDate = new Date(this.startDate.getFullYear(), 0, 1);
    this.clientFilterTypes.push({ id: 1, filterType: 'All' });
    this.clientFilterTypes.push({ id: 2, filterType: 'WholeSale' });
    this.clientFilterTypes.push({ id: 3, filterType: 'Retail' });
    this.clientFilterType = this.clientFilterTypes[0];
    this.refreshSalesData();
  }

  checkRole(roleId: any) {
    return this.userService.checkRole(roleId);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.gridHeight = this.screenHeight * .65;
    this.pivotGridHeight = this.screenHeight * .70;
  }


  refreshSalesData() {
    this.loadingVisible = true;
    this.dataService.getSalesDashData(
      this.datepipe.transform(this.startDate, 'MM/dd/yyyy'),
      this.datepipe.transform(this.endDate, 'MM/dd/yyyy'),
      this.user.companyId, this.snapShot).subscribe(data => {
        this.loadingVisible = false;
        this.yearlySummary = data.yearlySummary;
        this.salesData = data.salesDetails;
        this.MonthlySummary = [];
        data.monthlySummary.slice(0, 24).forEach(item => {
          const mb = {
            month: this.datepipe.transform(item.month, 'MMM-yy'),
            monthIndex: item.monthIndex,
            amount: item.amount,
            margin: item.margin,
          };
          this.MonthlySummary.push(mb);
        });

        this.buildCategorySummary();
        this.refreshSalesGrid();
      });
  }

  monthlychartPointClicked(e) {
    this.primarymonth = e.target._dataItem.data.monthIndex;
    this.buildCategorySummary();
  }

  CompareMonths() {
    this.buildCategorySummary();
  }

  refreshSalesGrid() {
    this.salesGridDataSource = new PivotGridDataSource({
      fields: [
        {
          caption: 'Category',
          dataField: 'categoryName',
          area: 'row',
          sortBySummaryField: 'total',
          sortOrder: 'desc'
        },
        {
          caption: 'Client',
          dataField: 'clientName',
          area: 'row',
          sortBySummaryField: 'total',
          sortOrder: 'desc'
        },
        {
          caption: 'Product Line',
          dataField: 'categoryName',
          area: 'row',
          sortBySummaryField: 'total',
          sortOrder: 'desc'
        },
        {
          dataField: 'billingMonth',
          dataType: 'date',
          area: 'column',
          sortOrder: 'desc',
          groupName: 'Date'
        },
        { groupName: 'Date', groupInterval: 'year', groupIndex: 0 },
        { groupName: 'Date', groupInterval: 'month', groupIndex: 1 },
        {
          caption: 'Sales ($)',
          dataField: 'total',
          dataType: 'number',
          summaryType: 'sum',
          format: 'currency',
          area: 'data',
          sortOrder: 'desc'
        }
      ],
      store: this.salesData
    });

  }

  buildCategorySummary() {

    const categoriesData1 = new Map<string, number>();
    for (const { categoryName, total } of this.salesData.filter(
      item => item.monthsPast === this.primarymonth)) {
      categoriesData1.set(categoryName, (categoriesData1.get(categoryName) || 0) + total);
    }

    this.categorySummary1 = [];
    categoriesData1.forEach((value: number, key: string) => {
      const mb = {
        category: key,
        amount: +value.toFixed(2),
      };
      this.categorySummary1.push(mb);
    });

    const month1 = this.salesData.filter(item => item.monthsPast === this.primarymonth).slice(0, 1);
    this.month1 = month1[0] !== undefined ? this.datepipe.transform(month1[0].billingMonth, 'MMM-yy') : 'No Data';

    const categoriesData2 = new Map<string, number>();
    for (const { categoryName, total } of this.salesData.filter(
      item => item.monthsPast === this.primarymonth + this.monthToCompare)) {
      categoriesData2.set(categoryName, (categoriesData2.get(categoryName) || 0) + total);
    }

    const month2 = this.salesData.filter(item => item.monthsPast === (this.primarymonth + this.monthToCompare)).slice(0, 1);
    this.month2 = month2[0] !== undefined ? this.datepipe.transform(month2[0].billingMonth, 'MMM-yy') : 'No Data';

    this.categorySummary2 = [];
    categoriesData2.forEach((value: number, key: string) => {
      const mb = {
        category: key,
        amount: +value.toFixed(2),
      };
      this.categorySummary2.push(mb);
    });

    let id = 0;
    this.categorySummary = [];
    this.categorySummary1.forEach(item => {
      const match = this.categorySummary2.filter(f => f.category === item.category);
      const mb = {
        id: id++,
        category: item.category,
        primaryMonth: this.primarymonth,
        secondaryMonth: this.primarymonth + this.monthToCompare,
        month1: item.amount,
        month2: +(match[0] !== undefined ? match[0].amount : 0),
        change: +(item.amount - (match[0] !== undefined ? match[0].amount : 0)).toFixed(2)
      };
      this.categorySummary.push(mb);
    });

    // Find UnMatched Categories
    this.categorySummary2.forEach(item => {
      const match = this.categorySummary1.filter(f => f.category === item.category);
      if (match[0] === undefined) {
        const mb = {
          id: id++,
          category: item.category,
          month1: 0,
          month2: +(item.amount),
          change: +(0 - item.amount).toFixed(2)
        };
        this.categorySummary.push(mb);
      }
    });
  }

  onCellPrepared(e) {
    if (e.rowType === 'data' && e.column.dataField === 'change') {
      e.cellElement.style.color = e.data.change >= 0 ? 'green' : 'red';
    }
  }

  onPivotCellPrepared({ cell, area, cellElement }) {
    cell.area = area;
    if (cell.area === 'row') {
      Object.assign(cellElement.style, this.getCssStyles());
    }
  }

  getCssStyles() {
    return {
      color: 'black',
      'font-weight': 'bold'
    };
  }

  focusChanged(e) {
    const row = e.row.data;

    // Map Customer1
    const clientData1 = new Map<string, number>();
    for (const { clientName, total } of this.salesData.filter(
      item => item.monthsPast === this.primarymonth && item.categoryName === row.category)) {
      clientData1.set(clientName, (clientData1.get(clientName) || 0) + total);
    }

    this.clientSummary1 = [];
    clientData1.forEach((value: number, key: string) => {
      const mb = {
        clientName: key,
        amount: +value.toFixed(2),
      };
      this.clientSummary1.push(mb);
    });

    // Map Customer1
    const clientData2 = new Map<string, number>();
    for (const { clientName, total } of this.salesData.filter(
      item => item.monthsPast === this.primarymonth + this.monthToCompare && item.categoryName === row.category)) {
      clientData2.set(clientName, (clientData2.get(clientName) || 0) + total);
    }

    this.clientSummary2 = [];
    clientData2.forEach((value: number, key: string) => {
      const mb = {
        clientName: key,
        amount: +value.toFixed(2),
      };
      this.clientSummary2.push(mb);
    });

    // Compare Clients
    let id = 0;
    this.clientSummary = [];
    this.clientSummary1.forEach(item => {
      const match = this.clientSummary2.filter(f => f.clientName === item.clientName);
      const mb = {
        id: id++,
        clientName: item.clientName,
        month1: item.amount,
        month2: +(match[0] !== undefined ? match[0].amount : 0),
        change: +(item.amount - (match[0] !== undefined ? match[0].amount : 0)).toFixed(2)
      };
      this.clientSummary.push(mb);
    });

    // Find UnMatched Categories
    this.clientSummary2.forEach(item => {
      const match = this.clientSummary1.filter(f => f.clientName === item.clientName);
      if (match[0] === undefined) {
        const mb = {
          id: id++,
          clientName: item.clientName,
          month1: 0,
          month2: +(item.amount),
          change: +(0 - item.amount).toFixed(2)
        };
        this.clientSummary.push(mb);
      }
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}

