import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';
//import { InvoiceDialogComponent } from '../invoice-dialog/invoice-dialog.component';

@Component({
  selector: 'app-product-sale-dialog',
  templateUrl: './product-sale-dialog.component.html',
  styleUrls: ['./product-sale-dialog.component.scss']
})
export class ProductSaleDialogComponent implements OnInit {
  user: any;
  inventoryLogs: any[] = [];
  auditLogs: any[] = [];
  selectedItem: any;
  reportData: any;
  dailyStats: any[] = [];
  datepipe: any;
  //dialogRef: MatDialogRef<InvoiceDialogComponent>;
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    partLinkId: any
  },
    private mdDialogRef: MatDialogRef<ProductSaleDialogComponent>,
    private dataService: DataService,
    private userService: UserService,
    private dialog: MatDialog) {
    mdDialogRef.disableClose = true;
    this.editInvoiceClick = this.editInvoiceClick.bind(this);
  }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.refreshAuditLogs(0);
  }

  refreshAuditLogs(logId: any){
    this.dataService.getPoductInventoryAuditLog(this.data.partLinkId, this.user.companyId,logId).subscribe(data => {
      this.reportData = data;
      if (this.inventoryLogs.length === 0){
        this.inventoryLogs = data.logs;
      }
      
      this.auditLogs = data.auditLogs;
      this.dailyStats = data.dailyStats;
    });
  }


  logSelectionChanged(e) {
    if (e.rowIndex >= 0) {
      this.selectedItem = e.row.data;
      this.refreshAuditLogs(e.row.data.id);
    }
  }

  onCellPrepared(e) {
    if (e.rowType === 'data' && e.column.dataField === 'orderQty') {
      e.cellElement.style.color = e.data.orderQty >= 0 ? 'black' : 'red';
    }
  }

  editInvoiceClick(e) {
    // this.dialogRef = this.dialog.open(InvoiceDialogComponent, {
    //   data: {
    //     invoiceId: e.row.data.invoiceId
    //   },
    //   height: '99%',
    //   width: '95%'
    // });

  }

  CloseClick() {
    this.mdDialogRef.close(true);
  }

}
