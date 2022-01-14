import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DxDataGridComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';

@Component({
  selector: 'app-security-dialog',
  templateUrl: './security-dialog.component.html',
  styleUrls: ['./security-dialog.component.scss']
})
export class SecurityDialogComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  user: any;
  users: any[];
  userMaps: any[];
  isAdmin = false;
  systemRoles: any[];
  errorMessage: any;
  selectedUser: any;
  activeStatus = true;
  messageDialog: MatDialogRef<MessageDialogComponent>;
  salesPeople: any[];

  constructor(private dataService: DataService,
    private userService: UserService,
    private toastr: ToastrService,
    private mdDialogRef: MatDialogRef<SecurityDialogComponent>,
    private dialog: MatDialog) {
    this.showPasswordClick = this.showPasswordClick.bind(this);
  }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.isAdmin = this.user.isAdmin;
    this.refreshProfiles();
  }

  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxCheckBox',
        options: {
          width: 150,
          onValueChanged: this.statusChanged.bind(this),
          hint: 'Show Active Users',
          text: 'Active',
          value: this.activeStatus,
        }
      });
  }

  statusChanged() {
    this.activeStatus = !this.activeStatus;
    this.refreshProfiles();
  }

  refreshProfiles() {
    this.dataService.getLoginRoles(this.user.companyId, this.activeStatus).subscribe(data => {
      this.users = data;
      this.refreshSalesPeople();
    });
  }

  refreshSalesPeople() {
    this.dataService.getSalesPeople(this.user.countryId).subscribe(data => {
      this.salesPeople = data;
    });
  }

  userFocusChanged(e) {
    this.selectedUser = e.row.data;
    this.userMaps = this.selectedUser.userMaps;
    this.systemRoles = this.selectedUser.systemRoles;
  }

  showPasswordClick() {
    this.messageDialog = this.dialog.open(MessageDialogComponent, {
      data: {
        message: this.selectedUser.password
      },
      height: '200px',
      width: '600px',
      panelClass: 'my-dialog'
    });
  }

  userAdded(e: { data: any }) {
    e.data.id = 0;
    e.data.companyId = this.user.companyId;
    this.dataService.AddLogin(e.data).subscribe(
      (response) => {
        this.toastr.success('User Added Successfully!', 'Success', {
          timeOut: 3000,
        });
        // Update Key of added entity from response object
        //e.data.id = response['id'];
        this.refreshProfiles();

      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error.error, 'User Add Failed');
      }
    );
  }

  userUpdated(e: any) {
    this.dataService.UpdateLogin(e.data).subscribe(
      (response) => {
        this.toastr.success('User Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
        this.refreshProfiles();
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error, 'User Update Failed');
      }
    );
  }

  userDeleted(e: any) {
    this.dataService.DeleteLogin(e.data.id).subscribe(
      (response) => {
        this.toastr.success('User Deleted Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('User Delete Failed ' + this.errorMessage);
        this.refreshProfiles();
      }
    );
  }

  userMapUpdated(e: any) {
    this.dataService.UpdateUserMap(e.data).subscribe(
      (response) => {
        this.toastr.success('User Map Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error, 'User Map Update Failed');
      }
    );
  }

  userRoleUpdated(e: any) {
    this.dataService.UpdateUserRole(e.data).subscribe(
      (response) => {
        this.toastr.success('User Role Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error, 'User Role Update Failed');
      }
    );
  }

  CloseClick() {
    this.mdDialogRef.close();
  }

}
