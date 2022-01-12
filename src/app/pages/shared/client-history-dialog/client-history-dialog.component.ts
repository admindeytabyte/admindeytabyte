import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-client-history-dialog',
  templateUrl: './client-history-dialog.component.html',
  styleUrls: ['./client-history-dialog.component.scss']
})
export class ClientHistoryDialogComponent implements OnInit {
  clientHistory: any[];
  title: string;
  searchMode: boolean;
  loadingVisible: boolean;
  allowf6: boolean;
  clientText: string;
  keyword: any;
  // line: any;
  // sku: any;
  // description: any;
  user: any;
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    accountId: number,
    product: number,
    companyId: number,
    mode: string,
    clientName: string
  },
    private userService: UserService,
    private dataService: DataService,
    private mdDialogRef: MatDialogRef<ClientHistoryDialogComponent>) {
  }

  ngOnInit() {
    this.title = 'Client History for (3 Years) of ' + this.data.clientName;
    this.clientText = 'Only for ' + this.data.clientName;
    this.user = this.userService.getUser();
    this.searchMode = this.data.mode === 'f2';
    this.allowf6 = this.checkRole(26);
    this.refreshData();
  }


  reset() {
    this.keyword = '';
  }

  selectionChanged(e) {
    this.data.mode = e.value === true ? 'f2' : 'f6';
    this.title = e.value === true ? 'Client History for (3 Years) of ' + this.data.clientName : 'Client History of 3 Years for all clients';
    this.refreshData();
  }

  searchProducts(e) {
    if (e === undefined) {
      return;
    }
    if (e.value === undefined) {
      this.clientHistory = [];
      return;
    }

    this.clientHistory = [];
    this.dataService.getProductsforClient(this.data.accountId,this.keyword).subscribe(data => {
      this.loadingVisible = false;
      this.clientHistory = data;
    });

  }

  // refreshProducts() {
  //   this.loadingVisible = true;
  //   const productParams = {
  //     line: this.line !== undefined ? this.line : '',
  //     sku: this.sku !== undefined ? this.sku : '',
  //     description: this.description !== undefined ? this.description : '',
  //     accountId: this.data.accountId,
  //     companyId: this.user.companyId
  //   }

  //   this.clientHistory = [];
  //   this.dataService.getProductsforInvoice(productParams).subscribe(data => {
  //     this.loadingVisible = false;
  //     this.clientHistory = data;
  //   });
  // }


  checkRole(roleId: any) {
    return this.userService.checkRole(roleId);
  }

  refreshData() {
    this.dataService.getClientHistoryByMode(this.data.accountId, this.data.product, this.data.companyId, this.data.mode).subscribe(data => {
      this.clientHistory = data;
    });
  }


  CloseClick() {
    this.mdDialogRef.close(true);
  }
}
