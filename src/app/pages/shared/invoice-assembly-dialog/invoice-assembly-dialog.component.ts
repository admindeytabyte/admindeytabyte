import { UserService } from './../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from './../../services/data.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';

@Component({
  selector: 'app-invoice-assembly-dialog',
  templateUrl: './invoice-assembly-dialog.component.html',
  styleUrls: ['./invoice-assembly-dialog.component.scss']
})
export class InvoiceAssemblyDialogComponent implements OnInit {
  user: any;
  assemblyPercComplete = 0;
  supplies: any[] = [];
  paints: any[] = [];
  product: any;
  invoice: any;
  errorMessage: any;
  focusedRowKey = 0;
  messageDialog: MatDialogRef<MessageDialogComponent>;

  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    invoice: any
  },
    private mdDialogRef: MatDialogRef<InvoiceAssemblyDialogComponent>,
    private dataService: DataService,
    private toastr: ToastrService,
    private userService: UserService,
    private dialog: MatDialog) {
    mdDialogRef.disableClose = true;
    this.focusedRowKey = 0;
    this.user = this.userService.getUser();
    this.quantityUpdated = this.quantityUpdated.bind(this);
    this.backOrdered = this.backOrdered.bind(this);
    this.confirmMixed = this.confirmMixed.bind(this);
  }

  ngOnInit() {

    this.mdDialogRef.keydownEvents().subscribe(event => {
      if (event.key === "Escape") {
        this.CloseClick();
      }
    });

    this.invoice = this.data.invoice;
    this.invoice.updateUser = this.user.userId;
    this.invoice.createdById = this.user.id;
    this.refreshDetails();
  }

  refreshDetails() {
    this.dataService.getAssemblyInvoiceItems(this.invoice.invoiceId, this.user.companyId).subscribe(details => {
      this.supplies = details.filter(item => item.lineType === 'S');
      this.paints = details.filter(item => item.lineType === 'V');
      this.calcAssemblyPerc();
      // this.assemblyPercComplete = Number(details[0].invoiceAssemblyPerc.toFixed(2));
      this.focusedRowKey = details.length > 0 && this.focusedRowKey === 0 ?
        Math.min.apply(Math, details.map(function (o) { return o.invoiceDtlid; })) : 0;
    });

  }


  calcAssemblyPerc() {
    const allItems = this.supplies.length + this.paints.length;
    const suppliesCount = this.supplies.filter(item => item.isAssembled === true).length;
    const paintsCount = this.paints.filter(item => item.isPaintMixed === true).length;
    this.invoice.assemblyPercComplete = Number(((suppliesCount + paintsCount) / allItems).toFixed(2));
    this.assemblyPercComplete = Number(((suppliesCount + paintsCount) / allItems).toFixed(2)) * 100;
  }

  productChanged(e) {
    if (e.row !== undefined) {
      this.product = e.row.data;
    }
  }

  setDispatch(e) {
    this.dataService.dispatchInvoice(this.invoice).subscribe(data => {
      this.mdDialogRef.close();
    },
      (error) => {
        this.errorMessage = error.error;
      });
  }

  onCellPrepared(e) {
    // if (e.rowType === 'data' && e.column.dataField === 'orderQty') {
    //   e.cellElement.style.color = e.data.orderQty >= 0 ? 'green' : 'red';
    // }

    // if (e.rowType === 'data' && e.column.dataField === 'orderQty') {
    //   e.cellElement.style.color = e.data.orderQty >= 0 ? 'green' : 'red';
    // }

    if (e.rowType === 'data' && e.column.type === 'buttons') {
      if (e.row.data.isAssembled === true) {
        e.cellElement.hidden = true;
      }
    }
  }

  backOrdered(e) {
    const row = e.row.data;
    this.product = this.supplies.filter(
      item => item.sequenceId === row.sequenceId)[0];
    this.product.remainingQty = this.product.orderQty;
    this.product.dispatchQty = 0;

    this.product.isAssembled = true;
    this.product.addedBy = this.user.userId;
    this.product.addedById = this.user.id;
    this.calcAssemblyPerc();
    this.product.invoiceAssemblyPerc = Number(this.assemblyPercComplete);
    // this.product.backOrderQty = this.product.remainingQty;

    this.dataService.updateAssemblyItem(this.product).subscribe(data => {
      this.refreshDetails();
    },
      (error) => {
        this.refreshDetails();
      });
  };


  quantityUpdated(e) {
    if (e.row !== undefined) {
      const row = e.row.data;
      this.product = this.supplies.filter(
        item => item.sequenceId === row.sequenceId)[0];
      this.product.dispatchQty = this.product.orderQty;
      this.product.remainingQty = 0;
    } else {
      this.product.remainingQty = this.product.orderQty - this.product.dispatchQty;
    }

    if (this.product.remainingQty > 0) {
      this.messageDialog = this.dialog.open(MessageDialogComponent, {
        data: {
          message: this.product.remainingQty + ' of ' + this.product.description + ' will be BackOrdered'
        },
        height: '200px',
        width: '600px',
        panelClass: 'my-dialog'
      });
    }

    //this.product.isAssembled = this.product.remainingQty === 0;
    this.product.isAssembled = true;
    this.product.addedBy = this.user.userId;
    this.product.addedById = this.user.id;
    this.calcAssemblyPerc();
    this.product.invoiceAssemblyPerc = Number(this.assemblyPercComplete);
    // this.product.backOrderQty = this.product.remainingQty;

    this.dataService.updateAssemblyItem(this.product).subscribe(data => {
      this.refreshDetails();
    },
      (error) => {
        this.refreshDetails();
      });
  }

  confirmMixed(e) {
    const row = e.row.data;
    row.addedBy = this.user.userId;
    row.addedById = this.user.id;
    this.dataService.updatePaintOrder(row).subscribe(data => {
      this.refreshDetails();
    },
      (error) => {
        this.refreshDetails();
      });
  }



  CloseClick() {
    this.mdDialogRef.close(true);
  }

}
