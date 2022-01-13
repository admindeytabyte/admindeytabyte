import { PaintcodeEditorComponent } from './../shared/paintcode-editor/paintcode-editor.component';
import { FormuleaEditorComponent } from './../shared/formulea-editor/formulea-editor.component';
import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './../../interfaces/app-state';
import { BasePageComponent } from '../base-page/base-page.component';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../services/data.service';
import { UserService } from '../services/user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-paints',
  templateUrl: './paints.component.html',
  styleUrls: ['./paints.component.scss']
})
export class PaintsComponent extends BasePageComponent implements OnInit, OnDestroy {
  errorMessage: any;
  screenHeight: number;
  screenWidth: number;
  controlHeight: number;
  selectedDate: any;
  user: any;
  paintOrders: any[];
  monthlySummary: any[];
  dailySummary: any[];
  hourlySummary: any[];
  hourlyChartData: any[];
  startDate: any;
  formuleaDialogRef: MatDialogRef<PaintcodeEditorComponent>;
  hourChartTitle: string;
  hourGridTitle: string;

  constructor(
    store: Store<AppState>,
    private toastr: ToastrService,
    private dataService: DataService,
    private userService: UserService,
    public datepipe: DatePipe,
    private router: Router,
    private dialog: MatDialog
  ) {
    super(store);
    this.onResize();
    this.pageData = {
      title: 'Paint Management',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Paint Orders',
          route: './paint-orders'
        }
      ]
    };
    this.confirmMixed = this.confirmMixed.bind(this);
    this.editVariantClick = this.editVariantClick.bind(this);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.controlHeight = this.screenHeight * .50;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.user = this.userService.getUser();
    if (this.checkRole(68) === false) {
      this.router.navigateByUrl('/vertical/notallowed');
      return;
    }
    //this.openPaintCodeEditor();

    this.startDate = new Date();
    //this.startDate.setDate(this.startDate.getDate() - 7);
    // this.startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate() - 7);
    this.refreshOrders();
  }

  checkRole(roleId: any) {
    return this.userService.checkRole(roleId);
  }

  refreshOrders() {
    this.dataService.getPaintOrderSummary(this.datepipe.transform(this.startDate, 'MM/dd/yyyy'), this.user.companyId).subscribe(data => {

      this.monthlySummary = [];
      data.monthlySummary.forEach(item => {
        const mb = {
          date: item.month,
          month: this.datepipe.transform(item.month, 'MMM-yyyy'),
          orderCount: item.orderCount
        };
        this.monthlySummary.push(mb);
      });


      this.dailySummary = [];
      data.dailySummary.forEach(item => {
        const mb = {
          date: item.day,
          day: this.datepipe.transform(item.day, 'dd-MMM'),
          orderCount: item.orderCount
        };
        this.dailySummary.push(mb);
        this.selectedDate = item.day;
      });
      this.hourlySummary = data.hourlySummary;
      this.setHourlyChart(this.selectedDate);
    });

  }

  dailyChartPointClicked(e) {
    this.setHourlyChart(e.target._dataItem.data.date);
  }

  setHourlyChart(date: Date) {
    this.hourChartTitle = 'Orders by Hour for ' + this.datepipe.transform(date, 'dd-MMM-yyyy');
    this.hourlyChartData = [];
    this.hourlySummary.filter(f => f.day === date).forEach(item => {
      const mb = {
        hour: item.hour,
        orderCount: item.orderCount
      };
      this.hourlyChartData.push(mb);
    });

    this.hourGridTitle = 'Orders for ' + this.datepipe.transform(date, 'dd-MMM-yyyy');
    this.dataService.getPaintOrders(this.datepipe.transform(date, 'MM/dd/yyyy'), this.user.companyId).subscribe(data => {
      this.paintOrders = data;
    });

  }

  openPaintCodeEditor() {
    this.formuleaDialogRef = this.dialog.open(PaintcodeEditorComponent, {
      height: '85%',
      width: '80%'
    });
  }



  confirmMixed(e) {
    const row = e.row.data;
    row.addedBy = this.user.userId;
    row.addedById = this.user.id;
    this.dataService.updatePaintOrder(row).subscribe(data => {
      this.refreshOrders();
    },
      (error) => {
        this.refreshOrders();
      });
  }

  editVariantClick(e) {
    // this.formuleaDialogRef = this.dialog.open(FormuleaEditorComponent, {
    //   data: {
    //     variant: e.row.data
    //   },
    //   height: '40%',
    //   width: '30%'
    // });
  }




  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
