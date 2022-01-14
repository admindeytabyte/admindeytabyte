import { ReleaseDialogComponent } from './../release-dialog/release-dialog.component';
import { UserService } from './../../services/user.service';
import { DataService } from './../../services/data.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvoiceDialogComponent } from '../invoice-dialog/invoice-dialog.component';

@Component({
  selector: 'app-quotes-onhold-view',
  templateUrl: './quotes-onhold-view.component.html',
  styleUrls: ['./quotes-onhold-view.component.scss']
})
export class QuotesOnholdViewComponent implements OnInit {
  releaseDialogRef: MatDialogRef<ReleaseDialogComponent>;
  dialogRef: MatDialogRef<InvoiceDialogComponent>;
  quotes: any[];
  constructor(
    private dataService: DataService,
    private userService: UserService,
    private mdDialogRef: MatDialogRef<QuotesOnholdViewComponent>,
    private dialog: MatDialog
  ) {
    this.releaseViewClick = this.releaseViewClick.bind(this);
    this.editInvoiceClick = this.editInvoiceClick.bind(this);
  }

  ngOnInit() {
    this.refreshQuotes();
  }

  onInvoicesToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          hint: 'Refresh',
          onClick: this.refreshQuotes.bind(this)
        }
      }
    );
  }

  onCellPrepared(e) {
    if (e.rowType === 'data' && e.column.dataField === 'clientName') {
      if (e.data.locked === true) {
        e.cellElement.style.color = 'white';
        e.cellElement.style.backgroundColor = 'maroon';
      }
    }
  }


  refreshQuotes() {
    const user = this.userService.getUser();
    this.dataService.getOnHoldInvoices(user.companyId).subscribe(data => {
      this.quotes = data;
    });
  }

  editInvoiceClick(e) {
    this.dialogRef = this.dialog.open(InvoiceDialogComponent, {
      data: {
        invoiceId: e.row.data.invoiceId
      },
      height: '99%',
      width: '95%'
    });
  }




  releaseViewClick(e) {
    this.releaseDialogRef = this.dialog.open(ReleaseDialogComponent, {
      data: {
        invoiceId: e.row.data.invoiceId
      },
      height: '80%',
      width: '70%',
      panelClass: 'my-dialog'
    });

    this.releaseDialogRef.afterClosed().subscribe(() => {
      this.refreshQuotes();
    });
  }

  CloseClick() {
    this.mdDialogRef.close();
  }

}
