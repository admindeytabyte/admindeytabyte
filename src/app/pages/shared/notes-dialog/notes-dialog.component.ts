import { DataService } from './../../services/data.service';
import { Component, OnInit, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-notes-dialog',
  templateUrl: './notes-dialog.component.html',
  styleUrls: ['./notes-dialog.component.scss']
})
export class NotesDialogComponent implements OnInit {
  @Input() accountId: any;
  notes: any[];
  profiles: any[];
  noteTypes: any[];
  errorMessage: any;
  user: any;

  constructor(@Inject(MAT_DIALOG_DATA)
  public data: {
    accountId: any
  },
    private mdDialogRef: MatDialogRef<NotesDialogComponent>,
    private dataService: DataService,
    private userService: UserService,
    private toastr: ToastrService) {
    mdDialogRef.disableClose = true;
  }


  ngOnInit() {
    if (this.accountId === undefined) {
      this.accountId = this.data.accountId;
    };
    this.user = this.userService.getUser();
    this.dataService.GetClientStatics().subscribe(data => {
      this.profiles = data.profiles;
      this.noteTypes = data.noteTypes;
    });
    this.refreshNotes();
    this.mdDialogRef.keydownEvents().subscribe(event => {
      if (event.key === "Escape") {
        this.CloseClick();
      }
    });

  }

  onGridToolbarPreparing(e: { toolbarOptions: { items: any } }) {
    e.toolbarOptions.items.unshift(
      {
        location: 'after',
        widget: 'dxCheckBox',
        options: {
          class: 'balanceCheckBox',
          hint: '',
          onValueChanged: this.refreshNotesAll.bind(this),
          value: true,
          text: 'Notes for Selected Account'
        }
      });
  }

  refreshNotesAll(e) {
    this.dataService.GetClientNotes(e.value === true ? this.accountId : 0, 0).subscribe(data => {
      this.notes = data;
    });
  }

  refreshNotes() {
    this.dataService.GetClientNotes(this.accountId, 0).subscribe(data => {
      this.notes = data;
    });
  }

  NotesAdded(e: any) {
    e.data.accountId = this.accountId;
    this.dataService.AddClientNote(e.data).subscribe(
      (response) => {
        this.toastr.success('Note Added Successfully!', 'Success', {
          timeOut: 3000,
        });
        // Update Key of added entity from response object
        e.data.id = response['id'];
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error.error, 'Note Add Failed');
      }
    );
  }

  NotesUpdated(e: any) {
    this.dataService.UpdateClientNote(e.data).subscribe(
      (response) => {
        this.toastr.success('Client Note Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error, 'Client Note Update Failed');
      }
    );
  }

  NotesDeleted(e: any) {
    this.dataService.DeleteClientNote(e.data.id).subscribe(
      (response) => {
        this.toastr.success('ClientNote Deleted Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('ClientNote Failed ' + this.errorMessage);
        this.refreshNotes();
      }
    );
  }

  NotesAddInit(e) {
    e.data.alert = true;
    e.data.loggedTime = new Date();
    e.data.loggedBy = this.user.id;
    e.data.loggedFor = this.user.id;
    e.data.estimatesByDefault = false;
  }

  public CloseClick() {
    this.mdDialogRef.close();
  }

}
