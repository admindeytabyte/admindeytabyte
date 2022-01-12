import { Component, OnInit, Input, OnChanges, Inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InvoiceDialogComponent } from '../invoice-dialog/invoice-dialog.component';

@Component({
  selector: 'app-client-contact-editor',
  templateUrl: './client-contact-editor.component.html',
  styleUrls: ['./client-contact-editor.component.scss']
})
export class ClientContactEditorComponent implements OnInit, OnChanges {
  @Input() accountId: number;
  clientContacts: any[];
  errorMessage: any;
  showCloseButton = false;
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    accountId: any,
  },
    private mdDialogRef: MatDialogRef<InvoiceDialogComponent>,
    private dataService: DataService,
    private toastr: ToastrService) {
    this.mdDialogRef.disableClose = true;
  }

  ngOnInit(): void {
    if (this.accountId === undefined) {
      this.accountId = this.data.accountId;
      this.showCloseButton = true;
    }
    this.refreshContacts();
  }

  ngOnChanges() {
    this.refreshContacts();
  }

  refreshContacts() {
    this.dataService.getClientContacts(this.accountId).subscribe(data => {
      this.clientContacts = data;
    });
  }

  clientContactAdded(e: { data: any }) {
    e.data.accountId = this.accountId;
    this.dataService.AddCustomerContact(e.data).subscribe(
      (response) => {
        this.toastr.success('Contact Added Successfully!', 'Success', {
          timeOut: 3000,
        });
        // Update Key of added entity from response object
        e.data.contactId = response['contactId'];
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error.error, 'Contact Add Failed');
      }
    );
  }

  clientContactUpdated(e: any) {
    this.dataService.UpdateCustomerContact(e.data).subscribe(
      (response) => {
        this.toastr.success('Contact Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error, 'Contact Update Failed');
      }
    );
  }

  clientContactDeleted(e: any) {
    this.dataService.DeleteCustomerContact(e.data.contactId).subscribe(
      (response) => {
        this.toastr.success('Contact Deleted Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.refreshContacts();
      }
    );
  }

  public CloseClick() {
    this.mdDialogRef.close(true);
  }

}
