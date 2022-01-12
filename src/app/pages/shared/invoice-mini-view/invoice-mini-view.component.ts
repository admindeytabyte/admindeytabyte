import { DataService } from './../../services/data.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-invoice-mini-view',
  templateUrl: './invoice-mini-view.component.html',
  styleUrls: ['./invoice-mini-view.component.scss']
})
export class InvoiceMiniViewComponent implements OnInit {
  invoice: any;
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    invoiceId: any,
  },
    private mdDialogRef: MatDialogRef<InvoiceMiniViewComponent>,
    private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getInvoice(this.data.invoiceId).subscribe(data => {
      this.invoice = data;
    });
  }

  CloseClick() {
    this.mdDialogRef.close(true);
  }

}
