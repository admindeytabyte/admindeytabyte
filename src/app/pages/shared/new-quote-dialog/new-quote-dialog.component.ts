import { CommonEditorDialogComponent } from './../common-editor-dialog/common-editor-dialog.component';
import { Component, OnInit, Inject, HostListener, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DxDataGridComponent } from 'devextreme-angular';
import { InvoiceDialogComponent } from '../invoice-dialog/invoice-dialog.component';
import { NotesDialogComponent } from '../notes-dialog/notes-dialog.component';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-new-quote-dialog',
  templateUrl: './new-quote-dialog.component.html',
  styleUrls: ['./new-quote-dialog.component.scss'],
  preserveWhitespaces: true
})
export class NewQuoteDialogComponent implements OnInit {
  @ViewChild('contactsGrid') contactsGrid: DxDataGridComponent;
  customers: any[] = [];
  contacts: any[] = [];
  addresses: any[] = [];
  selectedShippingAddress: any;
  deliveryModes: any[] = [];
  OrderTypes: any[] = [];
  orderType: any;
  activeOnly= true;
  deliveryModeText: any[];
  selectedAccount: any;
  delMode: any;
  odNotes: string;
  poNum: string;
  selectedContact: any;
  loadingVisible = false;
  quoteParams: any;
  dialogRef: MatDialogRef<InvoiceDialogComponent>;
  notesDialogRef: MatDialogRef<NotesDialogComponent>;
  user: any;
  clientDialogRef: MatDialogRef<CommonEditorDialogComponent>;
  screenHeight: number;
  screenWidth: number;
  listHeight: number;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    invoiceId: any,
  },
    private dialog: MatDialog,
    private mdDialogRef: MatDialogRef<NewQuoteDialogComponent>,
    private dataService: DataService,
    private userService: UserService,
    private toastr: ToastrService) {
    mdDialogRef.disableClose = true;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.listHeight = this.screenHeight * .65;
  }

  ngOnInit(): void {
    this.onResize();
    this.loadingVisible = true;
    this.user = this.userService.getUser();

    this.dataService.getInvoiceStatics().subscribe(data => {
      this.deliveryModes = data.deliveryModes;
      this.OrderTypes = data.orderTypes;
    });
    this.refreshClients();
    this.mdDialogRef.keydownEvents().subscribe(event => {
      if (event.key === "Escape") {
        this.CloseClick();
      }
    });
  }

  refreshClients(){
    this.dataService.getClients(this.user.companyId, false, this.activeOnly).subscribe(data => {
      this.customers = data;
      this.loadingVisible = false;
    });
  }

  listSelectionChanged = (e) => {
    this.deliveryModeText = this.deliveryModes.map(a => a.deliveryMode1);
    this.orderType = this.OrderTypes.filter(f => f.orderTypeId === 1)[0];
    this.delMode = null;
    this.odNotes = null;
    this.selectedContact = null;
    this.selectedAccount = e.addedItems[0];
    this.contacts = this.selectedAccount.clientContacts;
    this.addresses = this.selectedAccount.addressess;
    this.selectedShippingAddress = this.addresses.filter(f => f.addressTypeId === 1)[0]
  };

  contactsFocusChanged(e) {
    if (e.row !== undefined) {
      this.selectedContact = e.row.data;
    }
  }

  editAddressClick() {
    this.clientDialogRef = this.dialog.open(CommonEditorDialogComponent, {
      data: {
        editorType: 'clientAddress',
        client: this.selectedAccount
      },
      height: '500px',
      width: '1000px',
      panelClass: 'my-dialog'
    });
  }

  openNotesClick() {
    this.notesDialogRef = this.dialog.open(NotesDialogComponent, {
      data: {
        accountId: this.selectedAccount.accountId
      },
      height: '800px',
      width: '1000px',
      panelClass: 'my-dialog'
    });
  }

  clientContactAdded(e: { data: any }) {
    e.data.accountId = this.selectedAccount.accountId;
    this.dataService.AddCustomerContact(e.data).subscribe(
      (response) => {
        this.toastr.success('Contact Added Successfully!', 'Success', {
          timeOut: 3000,
        });
        // Update Key of added entity from response object
        e.data.contactId = response['contactId'];
        this.contactsGrid.instance.refresh();
      },
      (error) => {
        this.toastr.error(error.error, 'Contact Add Failed');
        this.contactsGrid.instance.refresh();
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
        this.contactsGrid.instance.refresh();
      },
      (error) => {
        this.toastr.error('Contact Delete Failed ');
        this.contactsGrid.instance.refresh();
      }
    );
  }

  createParams(status: string) {
    this.quoteParams = {
      accountId: this.selectedAccount.accountId,
      contactId: this.selectedContact.contactId,
      delMode: this.deliveryModes.filter(item => item.deliveryMode1 === this.delMode)[0].deliveryModeId,
      odNotes: this.odNotes,
      statusType: status,
      clientPo: this.poNum,
      createdBy: this.user.userId,
      createdById: this.user.id,
      orderTypeId: 1,
      shippingId: this.selectedShippingAddress !== undefined ? this.selectedShippingAddress.addressId : null
    };
  }

  waitListClicked() {
    this.createParams('W');
    this.loadingVisible = true;
    this.dataService.createQuotation(this.quoteParams).subscribe(data => {
      this.loadingVisible = false;
      this.toastr.success('Quotation Created ' + data.quoteNumber, 'PaintCity Inc', { timeOut: 1000 });
      this.selectedAccount = null;
    });
  }

  quotationClicked() {
    this.createParams('I');
    this.loadingVisible = true;
    this.dataService.createQuotation(this.quoteParams).subscribe(data => {
      this.loadingVisible = false;
      this.toastr.success('Quotation Created ' + data.quoteNumber, 'PaintCity Inc', { timeOut: 1000 });
      this.CloseClick();
      this.dialogRef = this.dialog.open(InvoiceDialogComponent, {
        data: {
          invoiceId: data.invoiceId
        },
        height: '99%',
        width: '95%'
      });
    });
  }

  public cancel() {
    this.close(false);
  }

  public close(value) {
    this.mdDialogRef.close(value);
  }
  public confirm() {
    this.close(true);
  }
  @HostListener('keydown.esc')
  public onEsc() {
    this.close(false);
  }

  CloseClick() {
    this.close(true);
  }


}
