import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-categories-editor',
  templateUrl: './categories-editor.component.html',
  styleUrls: ['./categories-editor.component.scss']
})
export class CategoriesEditorComponent implements OnInit {
  errorMessage: any;
  categories: any[];
  user: any;

  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.RefreshCategories();
  }

  RefreshCategories() {
    this.dataService.GetCategories().subscribe(data => {
      this.categories = data;
    });
  }

  CategoriesAdded(e: { data: any }) {
    e.data.categoryId = 0;
    e.data.companyId = this.user.companyId;
    this.dataService.AddCategories(e.data).subscribe(
      (response) => {
        this.toastr.success('Added Successfully!', 'Success', {
          timeOut: 2000,
        });
        // Update Key of added entity from response object
        e.data.categoryId = response['categoryId'];
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error.error, 'Add Failed');
      }
    );
  }

  CategoriesUpdated(e: any) {
    e.data.companyId = this.user.companyId;
    this.dataService.UpdateCategories(e.data).subscribe(
      (response) => {
        this.toastr.success('Updated Successfully!', 'Success', {
          timeOut: 2000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error, 'Update Failed');
      }
    );
  }

  CategoriesDeleted(e: any) {
    this.dataService.DeleteCategories(e.data.categoryId).subscribe(
      (response) => {
        this.toastr.success('Deleted Successfully!', 'Success', {
          timeOut: 2000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Delete Failed ' + this.errorMessage);
        this.RefreshCategories();
      }
    );
  }



}
