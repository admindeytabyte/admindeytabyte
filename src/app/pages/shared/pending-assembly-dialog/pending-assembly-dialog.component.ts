import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-pending-assembly-dialog',
  templateUrl: './pending-assembly-dialog.component.html',
  styleUrls: ['./pending-assembly-dialog.component.scss']
})
export class PendingAssemblyDialogComponent implements OnInit {
  user: any;

  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    pendingItems: any[]
  },
    private mdDialogRef: MatDialogRef<PendingAssemblyDialogComponent>,
    private dataService: DataService,
    private userService: UserService,
    private toastr: ToastrService) {
    this.user = this.userService.getUser();
  }

  ngOnInit() {


  }

  CloseClick() {
    this.mdDialogRef.close(true);
  }

}
