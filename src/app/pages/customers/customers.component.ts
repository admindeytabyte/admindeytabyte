import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { AddclientDialogComponent } from './../shared/addclient-dialog/addclient-dialog.component';
import { PaymentDialogComponent } from './../shared/payment-dialog/payment-dialog.component';
import { ClientCommissionsDialogComponent } from './../shared/client-commissions-dialog/client-commissions-dialog.component';
import { NotesDialogComponent } from './../shared/notes-dialog/notes-dialog.component';
import { Component, OnInit, OnDestroy, HostListener, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../interfaces/app-state';
import { BasePageComponent } from '../base-page/base-page.component';
import { DataService } from '../services/data.service';
import { ToastrService } from 'ngx-toastr';
import { BalanceSummary } from '../shared/interfaces/balanceSummary';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { InvoiceDialogComponent } from '../shared/invoice-dialog/invoice-dialog.component';
import { CommonEditorDialogComponent } from '../shared/common-editor-dialog/common-editor-dialog.component';
import { SalesDialogComponent } from '../shared/sales-dialog/sales-dialog.component';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { AccountBalanceComponent } from '../shared/account-balance/account-balance.component';
import { ClientTransactionsComponent } from '../shared/client-transactions/client-transactions.component';
import { ClientDiscountsDialogComponent } from '../shared/client-discounts-dialog/client-discounts-dialog.component';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent extends BasePageComponent implements OnInit, OnDestroy {
  @ViewChild(AccountBalanceComponent) balances: AccountBalanceComponent;
  customers: any[] = [];
  screenHeight: number;
  screenWidth: number;
  selectedAccount: any = null;
  focusedRowKey: 0;
  calcSales = false;
  customerGridHeight = 0;
  loadingVisible = false;
  errorMessage: any;
  cities: any[];
  provinces: any[];
  countries: any[];
  zones: any[];
  chargeTypes: any[];
  paymentTypes: any[];
  salesPeople: any[];
  activeOnly = true;
  phoneRules: any = {
    X: /[02-9]/
  }
  receivables: any[];
  //balances: any[] = [];
  //monthlyBalance: any[] = [];
  invoices: any[];
  quotations: any[];
  dialogRef: MatDialogRef<InvoiceDialogComponent>;
  clientDialogRef: MatDialogRef<CommonEditorDialogComponent>;
  clientPaymentDialogRef: MatDialogRef<PaymentDialogComponent>;
  notesDialogRef: MatDialogRef<NotesDialogComponent>;
  salesDialogRef: MatDialogRef<SalesDialogComponent>;
  commishDialogRef: MatDialogRef<ClientCommissionsDialogComponent>;
  newclientDialogRef: MatDialogRef<AddclientDialogComponent>;
  transactionsDialogRef: MatDialogRef<ClientTransactionsComponent>;
  clientMatrixDialogRef: MatDialogRef<ClientDiscountsDialogComponent>;
  user: any;

  constructor(private dataService: DataService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router,
    store: Store<AppState>,
  ) {
    super(store);
    this.onResize();
    this.pageData = {
      title: 'Customer Management',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Management',
          route: './customers'
        },
        {
          title: 'Customers'
        }
      ]
    };
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.user = this.userService.getUser();
    if (this.checkRole(40) === false) {
      this.router.navigateByUrl('/vertical/notallowed');
      return;
    }
    this.getStatics();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.customerGridHeight = this.screenHeight * .60;
  }

  checkRole(roleId: any) {
    return this.userService.checkRole(roleId);
  }

  getStatics() {
    this.dataService.getStatics(this.user.companyId).subscribe(data => {
      this.provinces = data.provinces;
      this.zones = data.zones;
      this.chargeTypes = data.chargeTypes;
      this.paymentTypes = data.paymentTypes;
      this.salesPeople = data.salesPeople;
      this.countries = data.countries;
      this.cities = data.cities;
      this.refreshClients();
    });
  }


  refreshClients() {
    this.loadingVisible = true;
    this.dataService.getClients(this.user.companyId, true, this.activeOnly).subscribe(data => {
      this.loadingVisible = false;
      this.customers = data;
      this.focusedRowKey = data.length > 0 ?
        Math.min.apply(Math, data.map(function (o) { return o.accountId; })) : 0;
    });
  }

  customerFocusChanged(e) {
    this.selectedAccount = e.row.data;
    // this.openInvoicePayments();
    if (this.balances != null){
      this.balances.accountId = this.selectedAccount.accountId;
      this.balances.refresh();
    }
    
  }




  onclientGridToolbarPreparing(e: { toolbarOptions: { items: any } }) {
    e.toolbarOptions.items.unshift(
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 150,
          text: 'Add New',
          onClick: this.addNewClient.bind(this)
        }
      },
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 150,
          text: 'Invoices',
          onClick: this.openInvoices.bind(this)
        }
      },
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 120,
          text: 'Contacts',
          onClick: this.openContacts.bind(this)
        }
      },
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 120,
          text: 'Address',
          onClick: this.openAddress.bind(this)
        }
      },
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 120,
          text: 'Payments',
          onClick: this.openInvoicePayments.bind(this),
          visible: this.checkRole(3)
        }
      },
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 150,
          text: 'Transactions',
          onClick: this.openTransactions.bind(this),
          visible: this.checkRole(3)
        }
      },
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 120,
          text: 'Discounts',
          onClick: this.openDiscounts.bind(this)
        }
      },
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 150,
          text: 'Commissions',
          onClick: this.openCommissions.bind(this)
        }
      },
      {
        location: 'before',
        widget: 'dxButton',
        options: {
          width: 120,
          text: 'Notes',
          onClick: this.openNotes.bind(this)
        }
      },
      {
        location: 'after',
        widget: 'dxCheckBox',
        options: {
          text: 'Active Only',
          value: this.activeOnly,
          onValueChanged: this.SetActiveMode.bind(this),
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'refresh',
          onClick: this.refreshClients.bind(this)
        }
      },
      {
        location: 'after',
        widget: 'dxButton',
        options: {
          icon: 'chart',
          hint: 'Sales Analysis',
          onClick: this.showSales.bind(this)
        }
      });
  }

  SetActiveMode(e){
    this.activeOnly = e.value;
    this.refreshClients();
  }


  showSales(e) {
    if (this.selectedAccount === undefined || this.selectedAccount === null) {
      alert('Please Select a Client');
      return;
    }
    this.salesDialogRef = this.dialog.open(SalesDialogComponent, {
      data: {
        accountId: this.selectedAccount.accountId,
      },
      height: '90%',
      width: '90%'
    });
  }

  SetShowSalesFilter(e) {
    this.calcSales = e.value;
  }

  addNewClient() {
    this.newclientDialogRef = this.dialog.open(AddclientDialogComponent, {
      width: (this.screenWidth * .25) + 'px',
      height: (this.screenHeight * .20) + 'px',
      panelClass: 'my-dialog'
    });

    this.newclientDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getStatics();
        this.refreshClients();
      }
    });
  }

  openInvoices() {
    if (this.selectedAccount === undefined || this.selectedAccount === null) {
      alert('Please Select a Client');
      return;
    }
    this.clientDialogRef = this.dialog.open(CommonEditorDialogComponent, {
      data: {
        editorType: 'clientInvoices',
        client: this.selectedAccount
      },
      height: (this.screenHeight * .80) + 'px',
      width: (this.screenWidth * .60) + 'px',
      panelClass: 'my-dialog'
    });
  }

  openInvoicePayments() {
    if (this.selectedAccount === undefined || this.selectedAccount === null) {
      alert('Please Select a Client');
      return;
    }
    this.clientDialogRef = this.dialog.open(CommonEditorDialogComponent, {
      data: {
        editorType: 'clientInvoicePayments',
        client: this.selectedAccount
      },
      height: (this.screenHeight * .90) + 'px',
      width: (this.screenWidth * .80) + 'px',
      panelClass: 'my-dialog'
    });
  }

  openTransactions() {
    if (this.selectedAccount === undefined || this.selectedAccount === null) {
      alert('Please Select a Client');
      return;
    }
    this.transactionsDialogRef = this.dialog.open(ClientTransactionsComponent, {
      data: {
        accountId: this.selectedAccount.accountId,
        companyName: this.selectedAccount.companyName,
      },
      height: (this.screenHeight * .60) + 'px',
      width: (this.screenWidth * .60) + 'px',
      panelClass: 'my-dialog'
    });
  }

  openDiscounts() {
    if (this.selectedAccount === undefined || this.selectedAccount === null) {
      alert('Please Select a Client');
      return;
    }
    // this.clientDialogRef = this.dialog.open(CommonEditorDialogComponent, {
    //   data: {
    //     editorType: 'clientDiscounts',
    //     client: this.selectedAccount
    //   },
    //   height: '70%',
    //   width: '70%',
    //   panelClass: 'my-dialog'
    // });

    this.clientMatrixDialogRef = this.dialog.open(ClientDiscountsDialogComponent, {
      data: {
        accountId: this.selectedAccount.accountId,
        isJobber: this.selectedAccount.isaJobber
      },
      height: '70%',
      width: '70%'
    });


  }

  openContacts() {
    if (this.selectedAccount === undefined || this.selectedAccount === null) {
      alert('Please Select a Client');
      return;
    }
    this.clientDialogRef = this.dialog.open(CommonEditorDialogComponent, {
      data: {
        editorType: 'clientContacts',
        client: this.selectedAccount
      },
      height: (this.screenHeight * .40) + 'px',
      width: (this.screenWidth * .40) + 'px',
      panelClass: 'my-dialog'
    });
  }

  openNotes() {
    if (this.selectedAccount === undefined || this.selectedAccount === null) {
      alert('Please Select a Client');
      return;
    }
    this.notesDialogRef = this.dialog.open(NotesDialogComponent, {
      data: {
        accountId: this.selectedAccount.accountId
      },
      height: (this.screenHeight * .60) + 'px',
      width: (this.screenWidth * .60) + 'px',
      panelClass: 'my-dialog'
    });
  }

  openCommissions() {
    if (this.selectedAccount === undefined || this.selectedAccount === null) {
      alert('Please Select a Client');
      return;
    }
    this.commishDialogRef = this.dialog.open(ClientCommissionsDialogComponent, {
      data: {
        accountId: this.selectedAccount.accountId
      },
      height: (this.screenHeight * .50) + 'px',
      width: (this.screenWidth * .40) + 'px',
      panelClass: 'my-dialog'
    });
  }

  openAddress() {
    if (this.selectedAccount === undefined || this.selectedAccount === null) {
      alert('Please Select a Client');
      return;
    }
    this.clientDialogRef = this.dialog.open(CommonEditorDialogComponent, {
      data: {
        editorType: 'clientAddress',
        client: this.selectedAccount
      },
      height: (this.screenHeight * .40) + 'px',
      width: (this.screenWidth * .55) + 'px',
      panelClass: 'my-dialog'
    });
  }

  customerAddInit(e) {
    e.data.isaJobber = false;
    e.data.companyName = '<< Client Company Name>>';
    e.data.valuedCustomer = false;
    e.data.locked = false;
    e.data.estimatesByDefault = false;
    if (this.cities.length === 0) {
      this.getStatics();
    }
  }

  clientAdded(e: { data: any }) {
    e.data.companyId = this.user.companyId;
    this.dataService.AddCustomer(e.data).subscribe(
      (response) => {
        this.toastr.success('Client Added Successfully!', 'Success', {
          timeOut: 3000,
        });
        // Update Key of added entity from response object
        e.data.accountId = response;
        this.refreshClients();
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Customer Add Failed');
        this.refreshClients();
      }
    );
  }

  clientUpdated(e: any) {
    this.dataService.UpdateCustomer(e.data).subscribe(
      (response) => {
        this.toastr.success('Client Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
        //this.refreshClients();
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Client Update Failed');
        //this.refreshClients();
      }
    );
  }

  clientDeleted(e: any) {
    this.dataService.DeleteCustomer(e.data.accountId).subscribe(
      (response) => {
        this.toastr.success('Client Deleted Successfully!', 'Success', {
          timeOut: 3000,
        });
        this.refreshClients();
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Client Delete Failed ');
        this.refreshClients();
      }
    );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  customers_tabClick(e) {

  }

}

