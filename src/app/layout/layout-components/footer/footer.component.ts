import { Component, HostBinding, OnInit } from '@angular/core';
import { ReleaseDialogComponent } from '../../../pages/shared/release-dialog/release-dialog.component';

import { environment } from '../../../../environments/environment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MessageDialogComponent } from '../../../pages/shared/message-dialog/message-dialog.component';
import { InvoiceDialogComponent } from '../../../pages/shared/invoice-dialog/invoice-dialog.component';
import { DispatchlogEditorComponent } from '../../../pages/shared/dispatchlog-editor/dispatchlog-editor.component';
import { DataService } from 'src/app/pages/services/data.service';
import { UserService } from 'src/app/pages/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @HostBinding('class') get class() {
    return 'app-footer';
  }
  alertDialogRef: MatDialogRef<ReleaseDialogComponent>;
  messageDialog: MatDialogRef<MessageDialogComponent>;
  invoiceDialogRef: MatDialogRef<InvoiceDialogComponent>;
  dispatchEditorDialogRef: MatDialogRef<DispatchlogEditorComponent>;
  invoices: any[];
  version: string;
  currentYear: number;
  user: any;
  invoiceText: any;
  invoiceNumber: string = '';
  constructor(
    private dataService: DataService,
    private userService: UserService,
    private dialog: MatDialog,
    private toastr: ToastrService,
  ) {
    this.version = environment.version;
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit() {
    this.user = this.userService.getUser();
  }

  checkRole(roleId: any) {
    return this.userService.checkRole(roleId);
  }

  openInvoice(){
    if (this.invoiceNumber.length <=4){
      return;
    }
    this.dataService.getInvoiceId(this.invoiceNumber, this.user.companyId).subscribe(data => {
      this.invoiceDialogRef = this.dialog.open(InvoiceDialogComponent, {
        data: {
          invoiceId: data
        },
        height: '99%',
        width: '95%'
      });
    },
      (error) => {
        // this.messageDialog = this.dialog.open(MessageDialogComponent, {
        //   data: {
        //     message: error
        //   },
        //   height: '200px',
        //   width: '600px',
        //   panelClass: 'my-dialog'
        // });
      });
  }

  lookupInvoice(e) {
    if (e === undefined) {
      return;
    }
    if (e.value === undefined) {
      return;
    }

    if (e.value.length === 0) {
      return;
    }

    this.dataService.getInvoiceId(e.value, this.user.companyId).subscribe(data => {
      this.invoiceDialogRef = this.dialog.open(InvoiceDialogComponent, {
        data: {
          invoiceId: data
        },
        height: '99%',
        width: '95%'
      });
    },
      (error) => {
        // this.messageDialog = this.dialog.open(MessageDialogComponent, {
        //   data: {
        //     message: error
        //   },
        //   height: '200px',
        //   width: '600px',
        //   panelClass: 'my-dialog'
        // });
      });
  }

  lookupLog(e) {
    if (e === undefined) {
      return;
    }
    if (e.value === undefined) {
      return;
    }

    if (e.value.length === 0) {
      return;
    }

    this.dispatchEditorDialogRef = this.dialog.open(DispatchlogEditorComponent, {
      data: {
        dispatchNum: e.value
      },
      height: '70%',
      width: '60%'
    });
  }



}
