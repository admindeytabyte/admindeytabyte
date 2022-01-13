//import { element } from 'protractor';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-formulea-editor',
  templateUrl: './formulea-editor.component.html',
  styleUrls: ['./formulea-editor.component.scss']
})
export class FormuleaEditorComponent implements OnInit {
  formuleaText: any;
  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    variant: any
  },
    private mdDialogRef: MatDialogRef<FormuleaEditorComponent>,
    private toastr: ToastrService,
    private dataService: DataService,
    private userService: UserService) { }

  ngOnInit() {

  }

  saveClick(e) {
    const formuleaModel = {
      variantId: this.data.variant.id,
      formuleaText: this.formuleaText
    };
    this.dataService.saveFormulea(formuleaModel).subscribe(data => {
      this.toastr.success('Update Success', 'PaintCity Inc', { timeOut: 1000 });
      this.mdDialogRef.close(true);
    });
  }

}
