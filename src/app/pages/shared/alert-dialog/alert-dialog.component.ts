import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent implements OnInit {

  notes: any[];
  profiles: any[];
  noteTypes: any[];
  errorMessage: any;
  user: any;

  constructor(
    private mdDialogRef: MatDialogRef<AlertDialogComponent>,
    private dataService: DataService,
    private userService: UserService,
    private toastr: ToastrService) {
    mdDialogRef.disableClose = true;
  }


  ngOnInit() {
    this.user = this.userService.getUser();
    this.dataService.GetClientStatics().subscribe(data => {
      this.profiles = data.profiles;
      this.noteTypes = data.noteTypes;
    });

    this.refreshAlerts();

    this.mdDialogRef.keydownEvents().subscribe(event => {
      if (event.key === "Escape") {
        this.CloseClick();
      }
    });
  }

  refreshAlerts() {
    this.dataService.GetAlerts(this.user.id).subscribe(data => {
      this.notes = data;
    });
  }

  public CloseClick() {
    this.mdDialogRef.close();
  }

}
