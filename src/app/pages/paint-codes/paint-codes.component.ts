import { AppState } from './../../interfaces/app-state';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BasePageComponent } from '../base-page/base-page.component';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../services/data.service';
import { UserService } from '../services/user.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-paint-codes',
  templateUrl: './paint-codes.component.html',
  styleUrls: ['./paint-codes.component.scss']
})
export class PaintCodesComponent extends BasePageComponent implements OnInit, OnDestroy {
  errorMessage: any;
  screenHeight: number;
  screenWidth: number;
  controlHeight: number;
  user: any;
  PaintCodes: any[];
  toners: any[];
  paintCode: any;
  year: any;
  make: any;
  model: any;
  PaintToners1: any[];
  PaintToners2: any[];
  CalculatedToners1: any[] = [];
  CalculatedToners2: any[] = [];
  paintCodeText: any;
  selectedLayer = 1;
  precision = 2;
  formuleaText: string;
  selectedVariant: any;
  constructor(
    store: Store<AppState>,
    private toastr: ToastrService,
    private dataService: DataService,
    private userService: UserService,
    public datepipe: DatePipe,
    private router: Router,
    private dialog: MatDialog
  ) {
    super(store);
    this.onResize();
    this.pageData = {
      title: 'Paint Code Management',
      loaded: true,
      breadcrumbs: [
        {
          title: 'Paints',
          route: './paint-codes'
        }
      ]
    };

  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    this.controlHeight = this.screenHeight * .85;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.user = this.userService.getUser();
    if (this.checkRole(68) === false) {
      this.router.navigateByUrl('/vertical/notallowed');
      return;
    }
    this.RefreshToners();
  }

  checkRole(roleId: any) {
    return this.userService.checkRole(roleId);
  }

  codeFocusChanged(e) {
    this.selectedVariant = e.row.data;
    this.paintCodeText = "Toners for " + this.selectedVariant.paintCode + '-' + this.selectedVariant.variance + '(' + this.selectedVariant.year + ')';
    this.refreshFormulea(this.selectedVariant.id);
  }

  RefreshToners() {
    this.dataService.GetTonerList().subscribe(data => {
      this.toners = data;
    });
  }

  refreshFormulea(id: any) {
    if (id === undefined) {
      return;
    }
    this.dataService.getPaintFormulea(id).subscribe(data => {
      this.PaintToners1 = data.filter(f => f.layerId === 1);
      this.PaintToners2 = data.filter(f => f.layerId === 2);
      this.calculateMeasures1(null);
      this.calculateMeasures2(null);
    });
  }


  calculateMeasures1(e) {
    const factor = e === null ? 1 : e.value;
    this.CalculatedToners1 = [];
    let accum = 0;
    let weight = 0;
    this.PaintToners1.forEach(item => {
      accum += item.weight * factor;
      weight = item.weight * factor;
      const toner = {
        pkId: item.pkId,
        id: item.id,
        sortId: item.sortId,
        layerId: item.layerId,
        code: item.code,
        name: item.name,
        weight: weight,
        accum: accum
      };
      this.CalculatedToners1.push(toner);
    });
  };

  calculateMeasures2(e) {
    const factor = e === null ? 1 : e.value;
    this.CalculatedToners2 = [];
    let accum = 0;
    let weight = 0;
    this.PaintToners2.forEach(item => {
      accum += item.weight * factor;
      weight = item.weight * factor;
      const toner = {
        pkId: item.pkId,
        id: item.id,
        sortId: item.sortId,
        layerId: item.layerId,
        code: item.code,
        name: item.name,
        weight: weight,
        accum: accum
      };
      this.CalculatedToners2.push(toner);
    });
  };

  saveLayer1Click(e) {
    const model = {
      variantId: this.selectedVariant.id,
      formuleaText: this.formuleaText,
      layerId: 1
    };
    this.saveFormulea(model);
  }

  saveLayer2Click(e) {
    const model = {
      variantId: this.selectedVariant.id,
      formuleaText: this.formuleaText,
      layerId: 2
    };
    this.saveFormulea(model);
  }

  saveFormulea(model) {
    this.dataService.saveFormulea(model).subscribe(data => {
      this.toastr.success('Update Success', 'PaintCity Inc', { timeOut: 1000 });
      this.refreshFormulea(model.variantId);
    });
  }

  searchCodes(e) {
    if (e === undefined) {
      return;
    }
    if (e.value === undefined) {
      this.PaintCodes = [];
      return;
    }
    this.refreshCodes();
  }

  refreshCodes() {
    this.paintCode = this.paintCode !== undefined ? this.paintCode : '';
    this.make = this.make !== undefined ? this.make : '';
    //this.model = this.model !== undefined ? this.model : '';
    this.year = this.year !== undefined ? this.year : 0;
    this.year = this.year !== null ? this.year : 0;

    this.dataService.getPaintCodes(this.paintCode, this.make, this.year).subscribe(data => {
      this.PaintCodes = data;
    });
  }

  codeAdded(e: { data: any }) {
    e.data.id = 0;
    this.dataService.AddPaintCode(e.data).subscribe(
      (response) => {
        this.toastr.success('Code Added Successfully!', 'Success', {
          timeOut: 3000,
        });
        // Update Key of added entity from response object
        e.data.id = response['id'];
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error.error, 'Code Add Failed');
      }
    );
  }

  codeUpdated(e: any) {
    this.dataService.UpdatePaintCode(e.data).subscribe(
      (response) => {
        this.toastr.success('Code Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error, 'Code Update Failed');
      }
    );
  }

  codeDeleted(e: any) {
    this.dataService.DeletePaintCode(e.data.id).subscribe(
      (response) => {
        this.toastr.success('Code Deleted Successfully!', 'Success', {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Code Delete Failed ' + this.errorMessage);
        this.refreshCodes();
      }
    );
  }

  //Update Formulas
  tonerUpdated(e: any) {
    this.dataService.UpdateToner(e.data).subscribe(
      (response) => {
        this.toastr.success('Toner Updated Successfully!', 'Success', {
          timeOut: 3000,
        });
        this.refreshFormulea(this.selectedVariant.id);
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error, 'Toner Update Failed');
      }
    );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
