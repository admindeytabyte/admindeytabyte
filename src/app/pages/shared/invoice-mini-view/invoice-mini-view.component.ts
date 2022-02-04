import { DataService } from './../../services/data.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvoicePrintDialogComponent } from '../invoice-print-dialog/invoice-print-dialog.component';

@Component({
  selector: 'app-invoice-mini-view',
  templateUrl: './invoice-mini-view.component.html',
  styleUrls: ['./invoice-mini-view.component.scss']
})
export class InvoiceMiniViewComponent implements OnInit {
  invoice: any;
  isInvoice: boolean;
  printDialogRef: MatDialogRef<InvoicePrintDialogComponent>;
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    invoiceId: any,
  },
    private dialog: MatDialog,
    private mdDialogRef: MatDialogRef<InvoiceMiniViewComponent>,
    private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getInvoice(this.data.invoiceId).subscribe(data => {
      this.invoice = data;
      this.isInvoice = this.invoice.invoiceTypeCde == 'I';
    });
  }

  CloseClick() {
    this.mdDialogRef.close(true);
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: "after",
        hint: "Print",
        widget: "dxButton",
        options: {
          icon: "print",
          visible: this.isInvoice,
          onClick: this.printInvoice.bind(this),
        }
      }
    );
  }

  printInvoice() {
    // this.buildInvoiceModel(this.selInvType !== undefined ? this.selInvType.invoiceType1 : 'Q');
    this.printDialogRef = this.dialog.open(InvoicePrintDialogComponent, {
      data: {
        invoice: this.invoice,
      },
      height: "95%",
      width: "50%",
      panelClass: "my-dialog",
    });
  }

}
