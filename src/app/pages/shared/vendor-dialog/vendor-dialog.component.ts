import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-vendor-dialog',
  templateUrl: './vendor-dialog.component.html',
  styleUrls: ['./vendor-dialog.component.scss']
})
export class VendorDialogComponent implements OnInit {
  errorMessage: any;
  user: any;
  vendors: any[];
  countries: any[];
  constructor(
    private mdDialogRef: MatDialogRef<VendorDialogComponent>,
    private dataService: DataService,
    private toastr: ToastrService,
    private userService: UserService,
    private dialog: MatDialog
  ) {
    mdDialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.dataService.getCountries().subscribe(data => {
      this.countries = data;
    });
    this.refreshVendors();
  }

  refreshVendors(){
    this.dataService.getvendors(this.user.companyId).subscribe(data => {
      this.vendors = data;
    });
  }

  CloseClick() {
    this.mdDialogRef.close();
  }

  vendorAdded(e: { data: any }) {
    e.data.vendorId=0;
    this.dataService.AddVendor(e.data,this.user.companyId).subscribe(
      (response) => {
        this.toastr.success('Vendor Added Successfully!', 'Success', {
          timeOut: 3000,
        });
        this.refreshVendors();
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error.error, 'Vendor Add Failed');
        this.refreshVendors();
      }
    );
  }

  vendorUpdated(e: any) {
    this.dataService.UpdateVendor(e.data).subscribe(
      (response) => {
        this.toastr.success('Vendor Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
        this.refreshVendors();
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error, 'Vendor Update Failed');
      }
    );
  }

  vendorDeleted(e: any) {
    this.dataService.DeleteVendor(e.data.vendorId).subscribe(
      (response) => {
        this.toastr.success('Vendor Deleted Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(this.errorMessage, 'Error', {
          timeOut: 5000,
        });
        this.refreshVendors();
      }
    );
  }

}
