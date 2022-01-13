import { ToastrService } from 'ngx-toastr';
import { UserService } from './../../services/user.service';
import { DataService } from './../../services/data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-client-commissions-dialog',
  templateUrl: './client-commissions-dialog.component.html',
  styleUrls: ['./client-commissions-dialog.component.scss']
})
export class ClientCommissionsDialogComponent implements OnInit {
  categories: any[];
  clientCommissions: any[];
  errorMessage: any;
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    accountId: any
  },
    private mdDialogRef: MatDialogRef<ClientCommissionsDialogComponent>,
    private dataService: DataService,
    private userService: UserService,
    private toastr: ToastrService) {
    mdDialogRef.disableClose = true;
  }

  ngOnInit() {
    this.RefreshCategories();
    this.refreshCommissions();
    this.mdDialogRef.keydownEvents().subscribe(event => {
      if (event.key === "Escape") {
        this.CloseClick();
      }
    });

  }

  RefreshCategories() {
    this.dataService.GetCategories().subscribe(data => {
      this.categories = data;
    });
  }

  refreshCommissions() {
    this.dataService.getClientCommissions(this.data.accountId).subscribe(data => {
      this.clientCommissions = data;
    });
  }

  clientCommissionAdded(e: { data: any }) {
    e.data.accountId = Number(this.data.accountId);
    this.dataService.AddCustomerCommission(e.data).subscribe(
      (response) => {
        this.toastr.success('Commission Added Successfully!', 'Success', {
          timeOut: 3000
        });
        // Update Key of added entity from response object
        e.data.id = response['id'];
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error.error, 'Commission Add Failed');
      }
    );
  }

  clientCommissionUpdated(e: any) {
    this.dataService.UpdateCustomerCommission(e.data).subscribe(
      (response) => {
        this.toastr.success('Commission Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error, 'Commission Update Failed');
      }
    );
  }

  clientCommissionDeleted(e: any) {
    this.dataService.DeleteCustomerCommission(e.data.id).subscribe(
      (response) => {
        this.toastr.success('Commission Deleted Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Commission Delete Failed ' + this.errorMessage);
        this.refreshCommissions();
      }
    );
  }

  public close(value) {
    this.mdDialogRef.close(value);
  }

  CloseClick() {
    this.close(true);
  }

}
