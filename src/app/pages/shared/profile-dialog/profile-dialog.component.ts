import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { DataService } from 'src/app/pages/services/data.service';
import { UserService } from 'src/app/pages/services/user.service';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent implements OnInit {
  roles: any[] = [];
  errorMessage: any;
  constructor(
    private dataService: DataService,
    private userService: UserService,
    private mdDialogRef: MatDialogRef<ProfileDialogComponent>
  ) { }

  ngOnInit() {
    this.dataService.getRoles().subscribe(data => {
      data.forEach((role: { granted: boolean; roleId: any; }) => {
        role.granted = this.userService.checkRole(role.roleId);
        this.roles.push(role);
      });
    });
  }

  CloseClick() {
    this.mdDialogRef.close(true);
  }
}
