import { Component,Output, EventEmitter, OnInit, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.scss']
})
export class InputDialogComponent implements OnInit {
  @Output() responseEvent: EventEmitter<any> = new EventEmitter<any>();
  response: string;
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    message: string
  }, 
  private mdDialogRef: MatDialogRef<InputDialogComponent>) { }

  ngOnInit() {
  }

  @HostListener('keydown.esc')
  public onEsc() {
    this.mdDialogRef.close();
  }

  returnResponse(e) {
    if (e === undefined) {
      return;
    }
    if (e.value === undefined) {
      return;
    }


    this.responseEvent.emit(this.response);
    this.mdDialogRef.close(true);
  }

}
