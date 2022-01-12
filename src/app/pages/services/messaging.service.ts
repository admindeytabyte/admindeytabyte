import { Injectable } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  response: any;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  constructor(private dialog: MatDialog) { }

  getConfirmation(title: any, message: any): any {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: title,
        message: message
      },
      height: '200px',
      width: '600px',
      panelClass: 'my-dialog'
    });

    const sub = this.confirmDialogRef.componentInstance.confirmEvent.subscribe((data) => {
      return data;
    });

    this.confirmDialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });

  }


}
