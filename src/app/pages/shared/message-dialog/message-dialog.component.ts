import { Message } from './../../../ui/interfaces/message';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA)
  public data: { message: any },
    private mdDialogRef: MatDialogRef<MessageDialogComponent>
  ) { }

  ngOnInit() {
    this.mdDialogRef.disableClose = true;
  }

  Okclick(e) {
    this.mdDialogRef.close(true);
  }

}
