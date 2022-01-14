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
import { CustomersComponent } from './customers/customers.component';
import { AddclientDialogComponent } from './shared/addclient-dialog/addclient-dialog.component';
import { ClientCommissionsDialogComponent } from './shared/client-commissions-dialog/client-commissions-dialog.component';
import { ClientTransactionsComponent } from './shared/client-transactions/client-transactions.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './not-found/not-found.component';
import { ProductsComponent } from './products/products.component';
import { ProductMergeDialogComponent } from './shared/product-merge-dialog/product-merge-dialog.component';
import { InputDialogComponent } from './shared/input-dialog/input-dialog.component';
import { DispatchComponent } from './dispatch/dispatch.component';
import { InvoiceAssemblyDialogComponent } from './shared/invoice-assembly-dialog/invoice-assembly-dialog.component';
import { PendingAssemblyDialogComponent } from './shared/pending-assembly-dialog/pending-assembly-dialog.component';
import { PaintsComponent } from './paints/paints.component';
import { PaintcodeEditorComponent } from './shared/paintcode-editor/paintcode-editor.component';
import { FormuleaEditorComponent } from './shared/formulea-editor/formulea-editor.component';
import { PaintCodesComponent } from './paint-codes/paint-codes.component';
import { BackOfficeComponent } from './back-office/back-office.component';
import { DispatchlogEditorComponent } from './shared/dispatchlog-editor/dispatchlog-editor.component';
import { SalesManagementComponent } from './sales-management/sales-management.component';
import { PurchasingComponent } from './purchasing/purchasing.component';
import { ReportsComponent } from './reports/reports.component';
import { BackOrdersReportComponent } from './reports/back-orders-report/back-orders-report.component';
import { DepositLogReportComponent } from './reports/deposit-log-report/deposit-log-report.component';
import { DispatchLogReportComponent } from './reports/dispatch-log-report/dispatch-log-report.component';
import { DispatchSummaryReportComponent } from './reports/dispatch-summary-report/dispatch-summary-report.component';
import { InvoiceReportComponent } from './reports/invoice-report/invoice-report.component';
import { MonthlySalesReportComponent } from './reports/monthly-sales-report/monthly-sales-report.component';
import { PaymentsReportComponent } from './reports/payments-report/payments-report.component';
import { PaymentsSummaryReportComponent } from './reports/payments-summary-report/payments-summary-report.component';
import { SalesBylineReportComponent } from './reports/sales-byline-report/sales-byline-report.component';
import { SalesCommReportComponent } from './reports/sales-comm-report/sales-comm-report.component';
import { StatementsReportComponent } from './reports/statements-report/statements-report.component';
import { NewQuoteDialogComponent } from './shared/new-quote-dialog/new-quote-dialog.component';
import { ProfileDialogComponent } from './shared/profile-dialog/profile-dialog.component';
import { AlertDialogComponent } from './shared/alert-dialog/alert-dialog.component';
import { QuotesOnholdViewComponent } from './shared/quotes-onhold-view/quotes-onhold-view.component';
import { SettingsDailogComponent } from './shared/settings-dailog/settings-dailog.component';
import { SecurityDialogComponent } from './shared/security-dialog/security-dialog.component';
import { IdleDialogComponent } from './shared/idle-dialog/idle-dialog.component';
import { AlertShowDialogComponent } from './shared/alert-show-dialog/alert-show-dialog.component';
import { TimelineComponent } from './shared/timeline/timeline.component';
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
    DashboardSalesComponent,
    CustomersComponent,
    AddclientDialogComponent,
    ClientCommissionsDialogComponent,
    ClientTransactionsComponent,
    LoginComponent,
    PageNotFoundComponent,
    ProductMergeDialogComponent ,
    ProductsComponent,
    InputDialogComponent,
    DispatchComponent,
    InvoiceAssemblyDialogComponent,
    PendingAssemblyDialogComponent,
    PaintsComponent,
    PaintcodeEditorComponent,
    FormuleaEditorComponent,
    PaintCodesComponent,
    BackOfficeComponent,
    DispatchlogEditorComponent,
    SalesManagementComponent,
    ReportsComponent,
    BackOrdersReportComponent,
    DepositLogReportComponent,
    DispatchLogReportComponent,
    DispatchSummaryReportComponent,
    InvoiceReportComponent,
    MonthlySalesReportComponent,
    PaymentsReportComponent,
    PaymentsSummaryReportComponent,
    SalesBylineReportComponent,
    SalesCommReportComponent,
    StatementsReportComponent,
    PurchasingComponent,
    NewQuoteDialogComponent,
    ProfileDialogComponent,
    AlertDialogComponent,
    QuotesOnholdViewComponent,
    SettingsDailogComponent,
    SecurityDialogComponent,
    IdleDialogComponent,
    AlertShowDialogComponent,
    TimelineComponent
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
