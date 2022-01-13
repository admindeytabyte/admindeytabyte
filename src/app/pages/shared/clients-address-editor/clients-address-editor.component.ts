import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';

@Component({
  selector: 'app-clients-address-editor',
  templateUrl: './clients-address-editor.component.html',
  styleUrls: ['./clients-address-editor.component.scss']
})
export class ClientsAddressEditorComponent implements OnInit {
  @Input() accountId: number;
  clientAddress: any[];
  addressTypes: any[];
  countries: any[];
  provinces: any[];
  cities: any[];
  errorMessage: any;
  messageDialog: MatDialogRef<MessageDialogComponent>;

  constructor(private dataService: DataService,
    private mdDialogRef: MatDialogRef<ClientsAddressEditorComponent>,
    private dialog: MatDialog,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.refreshAddress();
  }

  refreshAddress() {
    this.dataService.getClientAddress(this.accountId).subscribe(data => {
      this.clientAddress = data.clientAddresses;
      this.addressTypes = data.addressTypes;
      this.countries = data.country;
      this.provinces = data.provinces;
      this.cities = data.cities;
    });
  }

  clientAddressAdded(e: { data: any }) {
    e.data.accountId = this.accountId;
    this.dataService.AddCustomerAddress(e.data).subscribe(
      (response) => {
        this.toastr.success('Address Added Successfully!', 'Success', {
          timeOut: 3000,
        });
        // Update Key of added entity from response object
        // e.data.addressId = response['addressId'];
        this.refreshAddress();
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error.error, 'Address Add Failed');
        this.refreshAddress();
      }
    );
  }

  clientAddressUpdated(e: any) {
    this.dataService.UpdateCustomerAddress(e.data).subscribe(
      (response) => {
        this.toastr.success('Address Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
        this.refreshAddress();
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error, 'Address Update Failed');
        this.refreshAddress();
      }
    );
  }

  clientAddressDeleted(e: any) {
    this.dataService.DeleteCustomerAddress(e.data.addressId).subscribe(
      (response) => {
        this.toastr.success('Address Deleted Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Address Delete Failed ' + this.errorMessage);
        this.refreshAddress();
      }
    );
  }
  public CloseClick() {
    this.mdDialogRef.close(true);
  }

}
