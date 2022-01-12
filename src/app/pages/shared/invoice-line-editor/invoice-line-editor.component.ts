import { DataService } from './../../services/data.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvoiceDetail } from '../interfaces/InvoiceDetail';


@Component({
  selector: 'app-invoice-line-editor',
  templateUrl: './invoice-line-editor.component.html',
  styleUrls: ['./invoice-line-editor.component.scss']
})
export class InvoiceLineEditorComponent implements OnInit {
  product: InvoiceDetail[]=[];
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    invoiceItem: any,
  },
    private mdDialogRef: MatDialogRef<InvoiceLineEditorComponent>,
    private dataService: DataService) { 
      
  }

  getAmount = (dtl: InvoiceDetail) => dtl.orderQty * dtl.sell;

  ngOnInit() {
    this.product.push(this.data.invoiceItem);
  }

  save(){
    this.dataService.modifyInvoiceDtl(this.product[0]).subscribe(
      (data) => {
        this.mdDialogRef.close(true);    
      },
      (error) => {
        this.mdDialogRef.close(false);
      }
    );
    
  }

}
