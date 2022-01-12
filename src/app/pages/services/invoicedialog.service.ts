// import { InvoiceDialogComponent } from './../shared/invoice-dialog/invoice-dialog.component';
import { Injectable } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class InvoicedialogService {

  //dialogRef: MatDialogRef<InvoiceDialogComponent>;

  constructor(private dialog: MatDialog) { }

  // public open(options) {
  //   this.dialogRef = this.dialog.open(InvoiceDialogComponent, {
  //     data: {
  //       invoiceId: options.invoiceId
  //     },
  //     height: '99%',
  //     width: '95%'
  //   });
  // }

  // public confirmed(): Observable<any> {
  //   return this.dialogRef.afterClosed().pipe(take(1), map(res => {
  //     return res;
  //   }
  //   ));
  // }

}
