import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-common-editor-dialog',
  templateUrl: './common-editor-dialog.component.html',
  styleUrls: ['./common-editor-dialog.component.scss']
})
export class CommonEditorDialogComponent implements OnInit {
  clientContactsEditor: boolean;
  clientAddressEditor: boolean;
  errorMessage: any;
  client: any;
  clientInvoicePaymentsEditor: boolean;
  clientInvoicesEditor: boolean;
  clientDiscountsEditor: boolean;
  clientEstimatePaymentsEditor: boolean;
  clientNotesEditor: boolean;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    editorType: string,
    client: any
  },
    private mdDialogRef: MatDialogRef<CommonEditorDialogComponent>) {
    mdDialogRef.disableClose = true;
  }


  ngOnInit(): void {
    this.client = this.data.client;
    switch (this.data.editorType) {
      case 'clientContacts': {
        this.clientContactsEditor = true;
        break;
      }
      case 'clientAddress': {
        this.clientAddressEditor = true;
        break;
      }
      case 'clientInvoicePayments': {
        this.clientInvoicePaymentsEditor = true;
        break;
      }
      case 'clientInvoices': {
        this.clientInvoicesEditor = true;
        break;
      }
      case 'clientDiscounts': {
        this.clientDiscountsEditor = true;
        break;
      }
      case 'clientEstimatePayments': {
        this.clientEstimatePaymentsEditor = true;
        break;
      }
      case 'clientNotes': {
        this.clientNotesEditor = true;
        break;
      }
      default: {
        break;
      }
    }
    this.mdDialogRef.keydownEvents().subscribe(event => {
      if (event.key === "Escape") {
        this.CloseClick();
      }
    });
  }

  public CloseClick() {
    this.mdDialogRef.close();
  }

}
