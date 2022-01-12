import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DashboardHomeComponent } from './dashboards/dashboard-home/dashboard-home.component';

import {
  DxDataGridModule,
  DxSelectBoxModule,
  DxCheckBoxModule,
  DxButtonModule,
  DxHtmlEditorModule,
  DxToolbarModule,
  DxChartModule,
  DxLoadPanelModule,
  DxListModule,
  DxTileViewModule,
  DxTabPanelModule,
  DxTabsModule,
  DxFormModule,
  DxTemplateModule,
  DxPivotGridModule,
  DxPopupModule,
  DxTextBoxModule,
  DxBulletModule,
  DxPieChartModule,
  DxTextAreaModule,
  DxDateBoxModule,
  DxRadioGroupModule,
  DxDropDownBoxModule,
  DxNumberBoxModule,
  DxTooltipModule,
  DxSwitchModule,
  DxValidatorModule,
  DxVectorMapModule,
  DxMapModule,
  DxValidationSummaryModule,
  DxLoadIndicatorModule
} from 'devextreme-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UIModule } from '../ui/ui.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { AuthGuard } from './services/authguard';
import { ErrorDialogService } from './shared/errors/error-dialog.service';
import { LoadingDialogService } from './shared/loading/loading-dialog.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxPrintModule } from 'ngx-print';
import { ToastrModule } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@NgModule({
  imports: [
    CommonModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxDropDownBoxModule,
    DxButtonModule,
    DxToolbarModule,
    DxHtmlEditorModule,
    DxChartModule,
    DxLoadPanelModule,
    DxListModule,
    DxTileViewModule,
    DxTabPanelModule,
    DxTabsModule,
    DxFormModule,
    DxTemplateModule,
    DxPivotGridModule,
    DxPopupModule,
    DxTextBoxModule,
    DxBulletModule,
    DxPieChartModule,
    DxTextAreaModule,
    DxDateBoxModule,
    DxNumberBoxModule,
    DxSwitchModule,
    DxLoadIndicatorModule,
    DxValidatorModule,
    DxValidationSummaryModule,
    DxTooltipModule,
    DxRadioGroupModule,
    DxMapModule,
    DxVectorMapModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    UIModule,
    NgxPrintModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
    }),
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    DashboardHomeComponent
  ],
  exports: [],
  entryComponents: [
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    [DatePipe],
    [AuthGuard],
    [ErrorDialogService, LoadingDialogService]
  ]
})
export class PagesModule { }
