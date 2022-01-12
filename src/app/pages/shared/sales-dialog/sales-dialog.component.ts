import { CategoriesEditorComponent } from './../categories-editor/categories-editor.component';
import { Component, OnInit, ViewChild, Inject, HostListener } from '@angular/core';
import {
  DxPivotGridComponent,
  DxDataGridComponent
} from 'devextreme-angular';
import { AppState } from '../../../interfaces/app-state';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { DataService } from '../../services/data.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sales-dialog',
  templateUrl: './sales-dialog.component.html',
  styleUrls: ['./sales-dialog.component.scss']
})
export class SalesDialogComponent implements OnInit {
  @ViewChild(DxPivotGridComponent, { static: false }) pivotGrid: DxPivotGridComponent;
  // @ViewChild(DxChartComponent, { static: false }) chart: DxChartComponent;
  @ViewChild('drillDownDataGrid') drillDownDataGrid: DxDataGridComponent;
  salesGridDataSource: PivotGridDataSource;
  drillDownDataSource: any;
  salesPopupVisible = false;
  salesPopupTitle = '';
  salesDate: any;
  sumByDollar = true;
  salesData: any[];
  mainCategories = true;
  dialogRef: MatDialogRef<CategoriesEditorComponent>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    accountId: any
  },
    private dialog: MatDialog,
    public datepipe: DatePipe,
    private mdDialogRef: MatDialogRef<SalesDialogComponent>,
    private dataService: DataService) { }


  ngOnInit(): void {
    const currentDate = new Date();
    this.mdDialogRef.keydownEvents().subscribe(event => {
      if (event.key === "Escape") {
        this.CloseClick();
      }
    });
    this.salesDate = new Date(currentDate.getFullYear(), 0, 1)
    this.refreshSalesData();
  }

  refreshSalesData() {
    this.dataService.getSalesforClient(this.data.accountId,
      this.datepipe.transform(this.salesDate, 'MM/dd/yyyy'), this.mainCategories).subscribe(data => {
        this.salesData = data;
        this.refreshSales();
      });
  }


  switchValueChanged(e) {
    this.refreshSalesData();
  }

  dateChanged(e) {
    this.refreshSalesData();
  }

  refreshSales() {
    this.salesGridDataSource = new PivotGridDataSource({
      fields: [
        {
          caption: 'Purchased',
          dataField: 'purchased',
          area: 'filter',
          sortBySummaryField: this.sumByDollar ? 'amount' : 'orderQty',
          sortOrder: 'desc'
        },
        {
          caption: 'Category',
          dataField: 'category',
          area: 'row',
          sortBySummaryField: this.sumByDollar ? 'amount' : 'orderQty',
          sortOrder: 'desc'
        },
        {
          caption: 'Line',
          dataField: 'line',
          area: 'row',
          sortBySummaryField: this.sumByDollar ? 'amount' : 'orderQty',
          sortOrder: 'desc'
        },
        {
          caption: 'Sku',
          dataField: 'sku',
          area: 'row',
          sortBySummaryField: this.sumByDollar ? 'amount' : 'orderQty',
          sortOrder: 'desc'
        },
        {
          dataField: 'orderDate',
          dataType: 'date',
          area: 'column',
          sortOrder: 'desc',
          groupName: 'Date'
        },
        { groupName: 'Date', groupInterval: 'month', groupIndex: 0 },
        {
          caption: 'Sales ($)',
          dataField: this.sumByDollar ? 'amount' : 'orderQty',
          dataType: 'number',
          summaryType: 'sum',
          format: this.sumByDollar ? 'currency' : null,
          area: 'data',
          sortOrder: 'desc'
        }
      ],
      store: this.salesData
    });
  }

  // tslint:disable-next-line: use-lifecycle-interface
  //ngAfterViewInit() {
  // this.pivotGrid.instance.bindChart(this.chart.instance, {
  //   dataFieldsDisplayMode: 'splitPanes',
  //   alternateDataFields: false
  // });
  // }
  onPivotCellClick(e) {
    if (e.area === 'data') {
      const rowPathLength = e.cell.rowPath.length,
        rowPathName = e.cell.rowPath[rowPathLength - 1];
      this.drillDownDataSource = this.salesGridDataSource.createDrillDownDataSource(e.cell);
      this.salesPopupTitle = (rowPathName ? rowPathName : 'Total') + ' Drill Down Data';
      this.salesPopupVisible = true;
    }
  }

  onPopupShown() {
    this.drillDownDataGrid.instance.updateDimensions();
  }

  customizeTooltip(args) {
    return {
      html: args.seriesName + ' | Total<div class=\'currency\'>' + args.valueText + '</div>'
    };
  }

  showCategories() {
    this.dialogRef = this.dialog.open(CategoriesEditorComponent, {
      height: '700px',
      width: '800px',
      panelClass: 'my-dialog'
    });


    this.dialogRef.afterClosed().subscribe(() => {
      this.refreshSalesData();
    });
  }

  onCellPrepared({ cell, area, cellElement }) {
    cell.area = area;
    const { value } = cell;
    Object.assign(cellElement.style, this.getCssStyles(cell.area, value));
  }

  getCssStyles(dataType: any, value: any) {
    return dataType === 'row' ?
      {
        color: 'navy',
        'font-weight': 'bold',
        'font-size': '14'
      } :
      {
        'color': value !== undefined ? value.toString().indexOf('-') > -1 ? 'red' : 'black' : 'black',
        'font-weight': 'bold',
        'font-size': '10'
      };
  }

  public cancel() {
    this.close(false);
  }

  public close(value) {
    this.mdDialogRef.close(value);
  }
  public confirm() {
    this.close(true);
  }
  @HostListener('keydown.esc')
  public onEsc() {
    this.close(false);
  }

  CloseClick() {
    this.close(true);
  }

}
