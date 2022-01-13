import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';
import { NotesDialogComponent } from '../notes-dialog/notes-dialog.component';
//import { Workbook } from 'exceljs';
//import { saveAs } from 'file-saver';
import { AnonymousSubject } from 'rxjs/internal/Subject';
@Component({
  selector: 'app-client-transactions',
  templateUrl: './client-transactions.component.html',
  styleUrls: ['./client-transactions.component.scss']
})
export class ClientTransactionsComponent implements OnInit {
  errorMessage: any;
  transactions: any[];
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    accountId: any,
    companyName: any,
  },
    private mdDialogRef: MatDialogRef<NotesDialogComponent>,
    private dataService: DataService,
    private userService: UserService) {
    mdDialogRef.disableClose = true;
  }

  ngOnInit() {
    this.dataService.GetClientTransactions(this.data.accountId).subscribe(data => {
      this.transactions = data;
    });
  }

  // onExporting(e) {
  //   e.component.beginUpdate();
  //   e.component.columnOption('ID', 'visible', true);
  //   const workbook = new Workbook();
  //   const worksheet = workbook.addWorksheet('Transactions');
  //   const fileName = this.data.companyName + '_transactions.xlsx';
  //   exportDataGrid({
  //     component: e.component,
  //     worksheet: worksheet
  //   }).then(function () {
  //     workbook.xlsx.writeBuffer().then(function (buffer: BlobPart) {
  //       saveAs(new Blob([buffer], { type: 'application/octet-stream' }), fileName);
  //     });
  //   }).then(function () {
  //     e.component.columnOption('ID', 'visible', false);
  //     e.component.endUpdate();
  //   });

  //   e.cancel = true;
  // }

  public CloseClick() {
    this.mdDialogRef.close();
  }

}
