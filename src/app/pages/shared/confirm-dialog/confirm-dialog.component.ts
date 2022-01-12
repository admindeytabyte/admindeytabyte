import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  @Output() confirmEvent: EventEmitter<any> = new EventEmitter<any>();
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    title: any;
    message: any;
  },
    private mdDialogRef: MatDialogRef<ConfirmDialogComponent>) {
    mdDialogRef.disableClose = true;
  }

  ngOnInit() {
  }

  confirm() {
    this.confirmEvent.emit(true);
    this.mdDialogRef.close();
  }

  cancel() {
    this.confirmEvent.emit(false);
    this.mdDialogRef.close();
  }

}
