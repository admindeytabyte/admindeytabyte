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
import { InvoiceMiniViewComponent } from './shared/invoice-mini-view/invoice-mini-view.component';
import { ProductSaleDialogComponent } from './shared/product-sale-dialog/product-sale-dialog.component';
import { InvoiceDialogComponent } from './shared/invoice-dialog/invoice-dialog.component';
import { ProductBatchDialogComponent } from './shared/product-batch-dialog/product-batch-dialog.component';
import { ClientContactEditorComponent } from './shared/client-contact-editor/client-contact-editor.component';
import { ClientHistoryDialogComponent } from './shared/client-history-dialog/client-history-dialog.component';
import { InvoicePrintDialogComponent } from './shared/invoice-print-dialog/invoice-print-dialog.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { ProductDialogComponent } from './shared/product-dialog/product-dialog.component';
import { ProductEditorDialogComponent } from './shared/product-editor-dialog/product-editor-dialog.component';
import { ClientDiscountsDialogComponent } from './shared/client-discounts-dialog/client-discounts-dialog.component';
import { ProductEditorComponent } from './shared/product-editor/product-editor.component';
import { ProductAddDialogComponent } from './shared/product-add-dialog/product-add-dialog.component';
import { SalesDialogComponent } from './shared/sales-dialog/sales-dialog.component';
import { CategoriesEditorComponent } from './shared/categories-editor/categories-editor.component';
import { NotesDialogComponent } from './shared/notes-dialog/notes-dialog.component';
import { ReleaseDialogComponent } from './shared/release-dialog/release-dialog.component';
import { PackingSlipDialogComponent } from './shared/packing-slip-dialog/packing-slip-dialog.component';
import { MessageDialogComponent } from './shared/message-dialog/message-dialog.component';
import { InvoiceLineEditorComponent } from './shared/invoice-line-editor/invoice-line-editor.component';
import { PaymentDialogComponent } from './shared/payment-dialog/payment-dialog.component';
import { AccountBalanceComponent } from './shared/account-balance/account-balance.component';
import { QuantityBreaksComponent } from './shared/quantity-breaks/quantity-breaks.component';
import { ProductSlabEditorComponent } from './shared/product-slab-editor/product-slab-editor.component';
import { ProductLinesEditorComponent } from './shared/product-lines-editor/product-lines-editor.component';
import { ProductImagesEditorComponent } from './shared/product-images-editor/product-images-editor.component';
import { ProductRelatedEditorComponent } from './shared/product-related-editor/product-related-editor.component';
import { DashboardReceivablesComponent } from './dashboards/dashboard-receivables/dashboard-receivables.component';
import { CommonEditorDialogComponent } from './shared/common-editor-dialog/common-editor-dialog.component';
import { ClientsAddressEditorComponent } from './shared/clients-address-editor/clients-address-editor.component';
import { ClientInvoicePaymentsEditorComponent } from './shared/client-invoice-payments-editor/client-invoice-payments-editor.component';
import { ClientInvoicesDialogComponent } from './shared/client-invoices-dialog/client-invoices-dialog.component';
import { DashboardSalesComponent } from './dashboards/dashboard-sales/dashboard-sales.component';
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
    DashboardHomeComponent,
    InvoiceMiniViewComponent,
    ProductSaleDialogComponent,
    InvoiceDialogComponent,
    ProductBatchDialogComponent,
    ClientContactEditorComponent,
    ClientHistoryDialogComponent,
    InvoicePrintDialogComponent,
    ConfirmDialogComponent,
    ProductDialogComponent,
    ProductEditorDialogComponent,
    ClientDiscountsDialogComponent,
    ProductEditorComponent,
    ProductAddDialogComponent,
    SalesDialogComponent,
    CategoriesEditorComponent,
    NotesDialogComponent,
    ReleaseDialogComponent,
    PackingSlipDialogComponent,
    MessageDialogComponent,
    InvoiceLineEditorComponent,
    PaymentDialogComponent,
    AccountBalanceComponent,
    QuantityBreaksComponent ,
    ProductSlabEditorComponent,
    ProductLinesEditorComponent,
    ProductImagesEditorComponent,
    ProductRelatedEditorComponent,
    DashboardReceivablesComponent,
    CommonEditorDialogComponent,
    ClientsAddressEditorComponent,
    ClientInvoicePaymentsEditorComponent,
    ClientInvoicesDialogComponent,
    DashboardSalesComponent
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
