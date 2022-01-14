import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-alert-show-dialog',
  templateUrl: './alert-show-dialog.component.html',
  styleUrls: ['./alert-show-dialog.component.scss']
})
export class AlertShowDialogComponent implements OnInit {
  remDate: Date;


  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    alert: any
  },private userService: UserService,
  private toastr: ToastrService,
  private dataService: DataService,
  private mdDialogRef: MatDialogRef<AlertShowDialogComponent>) {
}

  ngOnInit() {
    var currentDate = new Date();
    this.remDate = new Date(currentDate.getTime() + 30*60000);
  }

  CloseClick() {
    this.mdDialogRef.close(true);
  }

  alertOk(){
    this.data.alert.alert=false;
    this.dataService.updateAlert(this.data.alert).subscribe(
      (response) => {
        this.mdDialogRef.close(true);
      },
      (error) => {
        this.toastr.error(error, 'Code Update Failed');
      }
    );
  }

  remind(){
    this.data.alert.alert=true;
    this.data.alert.reminderTime=this.remDate;
    this.dataService.updateAlert(this.data.alert).subscribe(
      (response) => {
        this.mdDialogRef.close(true);
      },
      (error) => {
        this.toastr.error(error, 'Code Update Failed');
      }
    );
  }

}
