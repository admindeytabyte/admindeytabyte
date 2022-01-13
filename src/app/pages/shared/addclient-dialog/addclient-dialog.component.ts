import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-addclient-dialog',
  templateUrl: './addclient-dialog.component.html',
  styleUrls: ['./addclient-dialog.component.scss']
})
export class AddclientDialogComponent implements OnInit {
  account: any;
  user: any;
  errorMessage: any;
  dataLoading = false;

  constructor(private mdDialogRef: MatDialogRef<AddclientDialogComponent>,
    private userService: UserService,
    private dataService: DataService,
    private toastr: ToastrService,) { }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.mdDialogRef.keydownEvents().subscribe(event => {
      if (event.key === "Escape") {
        this.CloseClick();
      }
    });
  }

  form_fieldDataChanged(e) {
    this.account = e.component.option('formData');
  }

  saveclicked() {
    this.account.companyId = this.user.companyId;
    this.dataLoading = true;
    this.dataService.AddNewCustomer(this.account).subscribe(
      (response) => {
        this.toastr.success('Customer Added Successfully!', 'Success', {
          timeOut: 3000,
        });
        this.dataLoading = false;
        this.mdDialogRef.close(true);
      },
      (error) => {
        this.toastr.error('Customer Add Failed');
        this.dataLoading = false;
        this.errorMessage = error.error;
      }
    );
  }

  CloseClick() {
    this.mdDialogRef.close(true);
  }

}
