import { InvoiceMiniViewComponent } from './../invoice-mini-view/invoice-mini-view.component';
import { UserService } from './../../services/user.service';
import { ConfirmDialogComponent } from './../confirm-dialog/confirm-dialog.component';
import { NotesDialogComponent } from './../notes-dialog/notes-dialog.component';
import { DataService } from './../../services/data.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-release-dialog',
  templateUrl: './release-dialog.component.html',
  styleUrls: ['./release-dialog.component.scss']
})
export class ReleaseDialogComponent implements OnInit {
  accountId: number;
  overDueInvoices: any[];
  payments: any[];
  details: any[];
  deliveryModes: any[] = [];
  invoiceTypes: any[] = [];
  selInvType: any;
  client: any;
  invoice: any;
  errorMessage: any;
  delNote: any;
  notesDialogRef: MatDialogRef<NotesDialogComponent>;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  selectedDelMode: any;
  user: any;
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    invoiceId: any,
  },
    private mdDialogRef: MatDialogRef<ReleaseDialogComponent>,
    private dataService: DataService,
    private toastr: ToastrService,
    private userService: UserService,
    private dialog: MatDialog) {
    mdDialogRef.disableClose = true;
  }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.dataService.getInvoiceReleaseView(this.data.invoiceId).subscribe(data => {
      this.overDueInvoices = data.overDueInvoices;
      this.payments = data.payments;
      this.details = data.invoice.details;
      this.accountId = data.invoice.accountId;
      this.client = data.invoice.client;
      this.invoice = data.invoice;
      this.deliveryModes = data.invoice.deliveryModes;
      this.selectedDelMode = this.deliveryModes.filter(f => f.deliveryModeId === data.invoice.deliveryModeId)[0];
      this.invoiceTypes = data.invoice.invoiceTypes;
      this.selInvType = this.invoiceTypes.filter(f => f.invoiceType1 === 'I')[0];
    });
  }


  releaseClicked() {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Release Confirmation', message: 'Do you want to Release this Quotation for assembly?'
      },
      height: '200px',
      width: '600px',
      panelClass: 'my-dialog'
    });

    const sub = this.confirmDialogRef.componentInstance.confirmEvent.subscribe((data) => {
      // Convert to Invoice
      if (data === true) {
        const invoiceModel = {
          invoiceId: this.invoice.invoiceId,
          delInstructions: this.invoice.deliveryInstructions,
          details: [],
          deletedItems: [],
          invoiceNotes: this.invoice.notes,
          delDate: this.invoice.deliveryDate,
          invoiceStatusCde: 'T',
          clientPo: this.invoice.clientPo,
          shippingId: this.invoice.shippingId !== null ? this.invoice.shippingId : 0,
          DeliveryModeId: this.selectedDelMode.deliveryModeId,
          convertType: this.selInvType.invoiceType1,
          updateUser: this.user.userId,
          createdById: this.user.id,
          companyId: this.user.companyId,
          discount: this.invoice.discount,
          discountPerc: this.invoice.discountPerc,

        }
        this.dataService.convertQuotation(invoiceModel).subscribe(data => {
          this.CloseClick();
        },
          (error) => {
            this.errorMessage = error.error;
            this.toastr.error('Invoice Conversion Failed');
          });
      }
    });

    this.confirmDialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }


  openNotesClicked() {
    this.notesDialogRef = this.dialog.open(NotesDialogComponent, {
      data: {
        accountId: this.accountId
      },
      height: '800px',
      width: '1000px',
      panelClass: 'my-dialog'
    });
  }

  deniedClicked() {

    const invoiceModel = {
      invoiceId: this.invoice.invoiceId,
      updateUser: this.user.userId,
      createdById: this.user.id
    }


    this.dataService.denyQuotation(invoiceModel).subscribe(data => {
      this.CloseClick();
    },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Invoice Conversion Failed');
      });
  }

  escalateClicked() {
    const invoiceModel = {
      invoiceId: this.invoice.invoiceId,
      updateUser: this.user.userId,
      createdById: this.user.id
    }
    this.dataService.escalateQuotation(invoiceModel).subscribe(data => {
      this.CloseClick();
    },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Invoice Conversion Failed');
      });
  }

  CloseClick() {
    this.mdDialogRef.close();
  }


}
