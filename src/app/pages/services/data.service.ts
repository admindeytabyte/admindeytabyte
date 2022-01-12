import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) {
  }

  // Errors
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // window.alert(errorMessage);
    return throwError(errorMessage);
  }

  GeoCodeAccount(accountId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Generics/GeoCodeAddress?accountId=' + accountId)
      .pipe(catchError(this.handleError));
  }

  getCompanies(): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Generics/GetCompanies')
      .pipe(catchError(this.handleError));
  }



  // Generic Object to Array
  getStatics(companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Generics/GetStatics?companyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  getHeaderCounts(companyId: any, userId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Generics/GetHeaderCounts?companyId=' + companyId + '&userId=' + userId)
      .pipe(catchError(this.handleError));
  }

  getAlerts(userId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'ClientNotes/GetAlerts?userID=' + userId)
      .pipe(catchError(this.handleError));
  }

  updateAlert(alert: any): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'ClientNotes/UpdateNote',
      alert
    );
  }

  // Roles
  public getRoles(): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'LoginProfiles/GetRoles')
      .pipe(catchError(this.handleError));
  }

  // Home Panel Data
  public getHomePanelData(numDays: any, companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'DashboardHome/GetHomePanelData?numDays=' + numDays + '&companyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  // Sales Dash Data
  public getSalesDashData(startDate: any, endDate: any, companyId: any, snapshot: boolean): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'DashboardSales/GetSalesDashData?startDate='
        + startDate + '&endDate=' + endDate + '&companyId=' + companyId + '&snapShot=' + snapshot)
      .pipe(catchError(this.handleError));
  }

  // Sales Receivable Data
  public getReceivablesDashData(startDate: any, companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'DashboardReceivables/GetReceivablesData?startDate='
        + startDate + '&companyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  public getReceivablesClient(accountId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'DashboardReceivables/GetReceivablesClient?accountId='
        + accountId)
      .pipe(catchError(this.handleError));
  }

  // Paint Orders
  public getPaintOrders(startDate: any, companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Paints/GetOpenPaintOrders?orderDate='
        + startDate + '&companyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  public getPaintOrderSummary(endDate: any, companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Paints/GetPaintOrderSummary?endDate='
        + endDate + '&companyId=' + companyId)
      .pipe(catchError(this.handleError));
  }




  public getPaintCodes(paintcode: string, make: string, year: number): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Paints/GetPaintCodes?paintCode=' + paintcode + '&make=' + make + '&year=' + year)
      .pipe(catchError(this.handleError));
  }

  public GetTonerList(): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'PaintFormulea/GetToners')
      .pipe(catchError(this.handleError));
  }


  public getPaintFormulea(id: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'PaintFormulea/GetFormulea?id=' + id)
      .pipe(catchError(this.handleError));
  }

  saveFormulea(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'PaintFormulea/SaveFormulea',
      params
    );
  }

  public AddPaintCode(paramData) {
    return this.httpClient.post(
      environment.baseURL + 'Paints',
      paramData
    );
  }

  public UpdatePaintCode(paramData: any) {
    return this.httpClient.put(
      environment.baseURL + 'Paints/' + paramData.id,
      paramData
    );
  }

  public DeletePaintCode(Id: any) {
    return this.httpClient.delete(
      environment.baseURL + 'Paints/' + Id
    );
  }

  //Toner Management
  public UpdateToner(paramData: any) {
    return this.httpClient.put(
      environment.baseURL + 'PaintFormulea/' + paramData.pkId,
      paramData
    );
  }


  // Invoice
  getCategories(): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Products/GetCategories')
      .pipe(catchError(this.handleError));
  }

  // Load Invoice
  public getInvoiceId(filter: any, companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'InvoiceHdrs/GetInvoiceId?filter=' + filter + '&companyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  public getInvoice(invoiceId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'InvoiceHdrs/GetInvoice?invoiceId=' + invoiceId)
      .pipe(catchError(this.handleError));
  }

  public getInvoiceAudits(invoiceId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'InvoiceAudits/GetInvoiceAuditLog?invoiceId=' + invoiceId)
      .pipe(catchError(this.handleError));
  }

  public getOnHoldInvoices(companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'InvoiceHdrs/GetOnHoldInvoices?companyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  public getAssemblyInvoices(companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'DispatchLogs/GetAssemblyInvoices?CompanyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  public getDispatchGenerics(companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'DispatchLogs/GetDispatchGenerics?CompanyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  public getDispatchLogs(companyId: any, status: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'DispatchLogs/GetDispatchLogs?CompanyId=' + companyId + '&status=' + status)
      .pipe(catchError(this.handleError));
  }

  public getDispatchInvoices(companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'DispatchLogs/GetDispatchInvoices?CompanyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  public getAssemblyInvoiceItems(invoiceId: any, companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'DispatchLogs/GetAssemblyInvoiceItems?invoiceId=' + invoiceId + '&CompanyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  //Check if any Items are open
  public getAssemblyOpenItems(logId: any, companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'DispatchLogs/CheckDispatchStatus?logId=' + logId +  '&CompanyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  public getInvoiceOpenItems(invoiceId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'DispatchLogs/CheckInvoiceStatus?invoiceId=' + invoiceId)
      .pipe(catchError(this.handleError));
  }

  public dispatchInvoice(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'DispatchLogs/DispatchInvoice',
      params
    );
  }

  public createNewDispatchLog(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'DispatchLogs/CreateDispatchLog',
      params
    );
  }

  public lockDispatchLog(logId): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'DispatchLogs/LockDispatchLog',
      logId
    );
  }

  public DeleteDispatchLog(Id: any) {
    return this.httpClient.delete(
      environment.baseURL + 'DispatchLogs/' + Id
    );
  }

  public UpdateDispatchLog(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'DispatchLogs/UpdateDispatchLog',
      params
    );
  }

  public DispatchDriver(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'DispatchLogs/DriverDispatch',
      params
    );
  }

  public CloseDriverLog(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'DispatchLogs/CloseDriverLog',
      params
    );
  }

  public UpdateDispatchLogNumber(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'DispatchLogs/UpdateDispatchLogNumber',
      params
    );
  }

  public updateAssemblyItem(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'DispatchLogs/UpdateProductAssembly',
      params
    );
  }

  public updatePaintOrder(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'DispatchLogs/UpdatePaintOrder',
      params
    );
  }

  // Back Office
  public getBackOfficeView(companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'DispatchLogs/GetBackOfficeView?CompanyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  public getDispatchLogInvoices(dispatchId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'DispatchLogs/GetDispatchLogInvoices?dispatchId=' + dispatchId)
      .pipe(catchError(this.handleError));
  }

  public getDispatchLogInvoicesByNumber(dispatchNum: any, companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'DispatchLogs/GetDispatchLogInvoicesByNumber?dispatchNum=' + dispatchNum + '&companyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  // Shipping Log

  public getShippingLogs(companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'ShippingLogs/GetShippingLogs?CompanyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  public AddShippingLog(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'ShippingLogs/CreateShippingLog',
      params
    );
  }

  public UpdateShippingLog(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'ShippingLogs/UpdateShippingLog',
      params
    );
  }

  public DeleteShippingLog(Id: any) {
    return this.httpClient.delete(
      environment.baseURL + 'ShippingLogs/' + Id
    );
  }

  public UpdateShippingLogNumber(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'ShippingLogs/UpdateShippingLogNumber',
      params
    );
  }

  public getInvoiceReleaseView(invoiceId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'InvoiceHdrs/GetInvoiceReleaseView?invoiceId=' + invoiceId)
      .pipe(catchError(this.handleError));
  }

  public getDetails(invoiceId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'InvoiceHdrs/GetDetails?invoiceId=' + invoiceId)
      .pipe(catchError(this.handleError));
  }

  public getReceivables(accountId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Clients/GetClientRecievables?accountId=' + accountId)
      .pipe(catchError(this.handleError));
  }

  public getReceivableSummary(accountId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Clients/GetClientRecievablesSummary?accountId=' + accountId)
      .pipe(catchError(this.handleError));
  }

  public getClientInvoices(accountId: any, unPaid: boolean): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Clients/GetClientInvoices?accountId=' + accountId + '&unPaid=' + unPaid)
      .pipe(catchError(this.handleError));
  }

  public GetClientInvoiceGenerics(accountId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Clients/GetClientPaymentGenerics?accountId=' + accountId)
      .pipe(catchError(this.handleError));
  }

  public GetInvoiceForPayment(invoiceId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'InvoiceHdrs/GetInvoiceForPayment?invoiceId=' + invoiceId)
      .pipe(catchError(this.handleError));
  }

  public GetClientPendingInvoices(accountId: any, invoiceType: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Clients/GetClientPendingInvoices?accountId=' + accountId + '&invoiceType=' + invoiceType)
      .pipe(catchError(this.handleError));
  }

  public GetClientCollections(accountId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Clients/GetCollectionInvoices?accountId=' + accountId)
      .pipe(catchError(this.handleError));
  }

  public GetClientPendingInvoicesPreview(params): Observable<any> {
    return this.httpClient.post(environment.baseURL + 'Clients/CalculatePaymentsOnAccount',
      params);
  }

  public GetClientPayments(accountId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Payments/GetPaymentsForAccount?accountId=' + accountId)
      .pipe(catchError(this.handleError));
  }

  logClientPayment(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'Payments/LogClientPayment',
      params
    );
  }

  logCollection(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'Payments/LogClientCollection',
      params
    );
  }

  reverseCollection(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'Payments/ReverseClientCollection',
      params
    );
  }

  closeInvoice(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'Payments/CloseInvoice',
      params
    );
  }

  getLogNumById(logId): Observable<any> {
    return this.httpClient
    .get(environment.baseURL + 'DispatchLogs/GetLogNumberById?logId=' + logId)
    .pipe(catchError(this.handleError));
  }

  public getLogByInvoice(filter: any, companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'DispatchLogs/GetLogNumberByInvoiceNumber?filter=' + filter + '&companyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  reverseClientPayment(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'Payments/ReverseClientPayment',
      params
    );
  }


  getRecentHistory(accountId: any, invoiceId: any, partLinkId: number): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'InvoiceHdrs/GetRecentHistory?accountId=' + accountId + '&invoiceId='
        + invoiceId + '&partLinkId=' + partLinkId)
      .pipe(catchError(this.handleError));
  }

  getClientHistory(accountId: any, invoiceId: any, numYears: number): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'InvoiceHdrs/GetClientHistory?accountId=' + accountId + '&invoiceId='
        + invoiceId + '&numYears=' + numYears)
      .pipe(catchError(this.handleError));
  }

  getClientHistoryByMode(accountId: any, partLinkId: any, companyId: any, mode: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'InvoiceHdrs/GetClientHistoryByMode?accountId=' + accountId +
        '&partLinkId=' + partLinkId + '&companyId=' + companyId + '&mode=' + mode)
      .pipe(catchError(this.handleError));
  }


  // Load Sales
  public getSalesforClient(accountId: any, salesDate: any, mainCategories: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'InvoiceHdrs/GetSales?accountId=' + accountId + '&salesDate='
        + salesDate + '&mainCategories=' + mainCategories)
      .pipe(catchError(this.handleError));
  }

  public getProductHistory(partLinkId: any, companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Products/GetProductHistory?partLinkId=' + partLinkId + '&companyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  // ProductFilter
  getProductsforInvoice(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'Products/GetProductsForInvoice',
      params
    );
  }

  

  getProductsforClient(accountId: any, keyword: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'InvoiceHdrs/GetProductsForClient?accountId=' + accountId + '&keyword=' + keyword)
      .pipe(catchError(this.handleError));
  }

  getProductsforBatch(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'Products/GetProductsForBatch',
      params
    );
  }

  getProduct(id: any, companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Products/GetProduct?partLinkId=' + id + '&companyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  getLinkedProducts(id: any, accountId: any, companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Products/GetLinkedProducts?partLinkId=' + id
        + '&accountId=' + accountId + '&companyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  getPoductInventoryAuditLog(partLinkId: any, companyId: any, logId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'products/GetProductAuditLog?partLinkId=' + partLinkId 
          + '&companyid=' + companyId + '&logId=' + logId)
      .pipe(catchError(this.handleError));
  }

  updateDiscounts(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'ClientDiscountMaps/UpdateDiscounts',
      params
    );
  }

  updateProductsBatch(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'Products/UpdateProductsBatch',
      params
    );
  }

  updateProductsIndex(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'Products/UpdateProductsIndex',
      params
    );
  }

  createQuotation(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'InvoiceHdrs/CreateInvoice',
      params
    );
  }

  updateInvoice(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'InvoiceHdrs/UpdateInvoice',
      params
    );
  }

  printInvoice(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'PrintJobs/CreateInvoicePrintJob',
      params
    );
  }

  returnItem(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'InvoiceDtls/ReturnItem',
      params
    );
  }

  cloneItem(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'InvoiceDtls/CloneItem',
      params
    );
  }

  deleteInvoice(invoiceId): Observable<any> {
    return this.httpClient.delete(
      environment.baseURL + 'InvoiceHdrs/' + invoiceId
    );
  }

  convertQuotation(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'InvoiceHdrs/ConvertQuotation',
      params
    );
  }

  convertEstimate(invoiceId: any): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'InvoiceHdrs/ConvertEstimate',
      invoiceId
    );
  }

  modifyInvoiceDtl(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'InvoiceDtls/ModifyInvoiceDtl',
      params
    );
  }

  voidInvoice(invoiceId: any,id: any): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'InvoiceHdrs/VoidInvoice?userId='  + id,
      invoiceId
    );
  }

  denyQuotation(invoiceId: any): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'InvoiceHdrs/DenyInvoice',
      invoiceId
    );
  }

  escalateQuotation(invoiceId: any): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'InvoiceHdrs/EscalateInvoice',
      invoiceId
    );
  }

  // Clients
  getInvoiceStatics(): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'InvoiceHdrs/GetInvoicesStatics')
      .pipe(catchError(this.handleError));
  }

  getClients(companyId: any, calcSale: boolean): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Clients/GetClientForCompany?companyId=' + companyId + '&calcSale=' + calcSale)
      .pipe(catchError(this.handleError));
  }

  getClientsForStatements(companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Clients/GetClientsForStatements?companyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  getStatementMonths(accountId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Reports/GetStatementMonths?accountId=' + accountId)
      .pipe(catchError(this.handleError));
  }

  getStatement(accountId: any, month: any, companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Reports/GenerateStatement?accountId='
        + accountId + '&month=' + month + '&companyId=' + companyId)
      .pipe(catchError(this.handleError));
  }



  // Methods for Customers
  public AddCustomer(paramData) {
    paramData.accountId = 0;
    return this.httpClient.post(
      environment.baseURL + 'Clients',
      paramData
    );
  }

  public AddNewCustomer(paramData) {
    return this.httpClient.post(
      environment.baseURL + 'Clients/AddNewClient',
      paramData
    );
  }

  public UpdateCustomer(paramData: any) {
    return this.httpClient.put(
      environment.baseURL + 'Clients/' + paramData.accountId,
      paramData
    );
  }

  public DeleteCustomer(accountId: any) {
    return this.httpClient.delete(
      environment.baseURL + 'Clients/' + accountId
    );
  }

  // Client Contacts
  public getClientContacts(accountId): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'ClientContacts/GetClientContacts?accountId=' + accountId)
      .pipe(catchError(this.handleError));
  }

  // Methods for Customer Contacts
  public AddCustomerContact(paramData) {
    paramData.contactId = 0;
    return this.httpClient.post(
      environment.baseURL + 'ClientContacts',
      paramData
    );
  }

  public UpdateCustomerContact(paramData: any) {
    return this.httpClient.put(
      environment.baseURL + 'ClientContacts/' + paramData.contactId,
      paramData
    );
  }

  public DeleteCustomerContact(contactId: any) {
    return this.httpClient.delete(
      environment.baseURL + 'ClientContacts/' + contactId
    );
  }

  // Client Address
  public getClientAddress(accountId): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'ClientAddresses/GetClientAddressById?accountId=' + accountId)
      .pipe(catchError(this.handleError));
  }

  // Methods for Customer Contacts
  public AddCustomerAddress(paramData) {
    paramData.addressId = 0;
    return this.httpClient.post(
      environment.baseURL + 'ClientAddresses',
      paramData
    );
  }

  public UpdateCustomerAddress(paramData: any) {
    return this.httpClient.put(
      environment.baseURL + 'ClientAddresses/' + paramData.addressId,
      paramData
    );
  }

  public DeleteCustomerAddress(addressId: any) {
    return this.httpClient.delete(
      environment.baseURL + 'ClientAddresses/' + addressId
    );
  }

  // Client Commissions
  public getClientCommissions(accountId): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'ClientCommissions/GetClientCommissions?accountId=' + accountId)
      .pipe(catchError(this.handleError));
  }

  // Methods for Customer Contacts
  public AddCustomerCommission(paramData) {
    paramData.id = 0;
    return this.httpClient.post(
      environment.baseURL + 'ClientCommissions',
      paramData
    );
  }

  public UpdateCustomerCommission(paramData: any) {
    return this.httpClient.put(
      environment.baseURL + 'ClientCommissions/' + paramData.id,
      paramData
    );
  }

  public DeleteCustomerCommission(id: any) {
    return this.httpClient.delete(
      environment.baseURL + 'ClientCommissions/' + id
    );
  }

  // Methods for Client Discounts
  public getDiscountGenerics(): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'ClientDiscountMaps/GetDiscountsGenerics')
      .pipe(catchError(this.handleError));
  }


  public getClientDiscounts(accountId: any, companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'ClientDiscountMaps/GetClientDiscountMaps?accountId=' + accountId + '&companyId=' + companyId)
      .pipe(catchError(this.handleError));
  }


  public CreateCustomerDiscounts(params) {
    return this.httpClient.post(
      environment.baseURL + 'ClientDiscountMaps/CreateDiscountMaps',
      params
    );
  }

  public UpdateCustomerDiscounts(paramData: any) {
    return this.httpClient.put(
      environment.baseURL + 'ClientDiscountMaps/' + paramData.id,
      paramData
    );
  }

  public DeleteCustomerDiscounts(id: any) {
    return this.httpClient.delete(
      environment.baseURL + 'ClientDiscountMaps/' + id
    );
  }

  public DiscountsBatchDelete(params: any) {
    return this.httpClient.post(
      environment.baseURL + 'ClientDiscountMaps/DiscountsBatchDelete',
      params
    );
  }



  public DeleteInvoiceDetail(delId: any) {
    return this.httpClient.delete(
      environment.baseURL + 'InvoiceDtls/' + delId
    );
  }

  // Methods for Products

  public GetProductById(id: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Products/GetProductById?id=' + id)
      .pipe(catchError(this.handleError));
  }

  public GetProductStatics(): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Products/GetProductStatics')
      .pipe(catchError(this.handleError));
  }

  public AddProduct(paramData: any) {
    return this.httpClient.post(
      environment.baseURL + 'Products',
      paramData
    );
  }

  public UpdateProduct(paramData: any) {
    return this.httpClient.put(
      environment.baseURL + 'Products/' + paramData.id,
      paramData
    );
  }

  public DeleteProduct(id: any) {
    return this.httpClient.delete(
      environment.baseURL + 'Products/' + id
    );
  }

  // Product Quantity Breaks
  public GetQuantityBreaks(companyId: any, partLinkId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'PartsQuantityBreaks/GetProductSlabs?companyId=' + companyId + '&partLinkId=' + partLinkId)
      .pipe(catchError(this.handleError));
  }

  public AddQuantityBreaks(paramData) {
    paramData.id = 0;
    return this.httpClient.post(
      environment.baseURL + 'PartsQuantityBreaks',
      paramData
    );
  }

  public updateProductAttributes(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'Products/UpdateProductAttributes',
      params
    );
  }

  public UpdateQuantityBreaks(paramData: any) {
    return this.httpClient.put(
      environment.baseURL + 'PartsQuantityBreaks/' + paramData.id,
      paramData
    );
  }

  public DeleteQuantityBreaks(id: any) {
    return this.httpClient.delete(
      environment.baseURL + 'PartsQuantityBreaks/' + id
    );
  }

  // Categories
  public GetAllCategories(): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'PartCategories/GetAllCategories')
      .pipe(catchError(this.handleError));
  }

  public GetCategories(): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'PartCategories/GetCategories')
      .pipe(catchError(this.handleError));
  }

  public AddCategories(paramData) {
    paramData.id = 0;
    return this.httpClient.post(
      environment.baseURL + 'PartCategories',
      paramData
    );
  }

  public UpdateCategories(paramData: any) {
    return this.httpClient.put(
      environment.baseURL + 'PartCategories/' + paramData.categoryId,
      paramData
    );
  }

  public DeleteCategories(id: any) {
    return this.httpClient.delete(
      environment.baseURL + 'PartCategories/' + id
    );
  }

  // Product Lines

  public GetProductLineTypes(): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'ProductLines/GetProductLineTypes')
      .pipe(catchError(this.handleError));
  }

  public GetAllProductLines(): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'ProductLines/GetAllProductLines')
      .pipe(catchError(this.handleError));
  }

  public GetProductLines(): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'ProductLines/GetProductLines')
      .pipe(catchError(this.handleError));
  }

  public AddProductLines(paramData) {
    paramData.lineId = 0;
    return this.httpClient.post(
      environment.baseURL + 'ProductLines',
      paramData
    );
  }

  public UpdateProductLines(paramData: any) {
    return this.httpClient.put(
      environment.baseURL + 'ProductLines/' + paramData.lineId,
      paramData
    );
  }

  public DeleteProductLines(id: any) {
    return this.httpClient.delete(
      environment.baseURL + 'ProductLines/' + id
    );
  }

  public GetProductLinkTypes(): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'ProductsRelated/GetLinkTypes')
      .pipe(catchError(this.handleError));
  }
  //ProductsMerge
  public getProductsByCategory(categoryId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Products/GetProductsByCategory?categoryId=' + categoryId)
      .pipe(catchError(this.handleError));
  }

  public getProductsByLine(lineId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Products/GetProductsByLine?lineId=' + lineId)
      .pipe(catchError(this.handleError));
  }

  getProductsforMerge(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'Products/GetProductsForMerge',
      params
    );
  }

  mergeCategory(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'Products/MergeCategories',
      params
    );
  }

  mergeLines(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'Products/MergeProductLines',
      params
    );
  }

  mergeProducts(params): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'Products/MergeProducts',
      params
    );
  }

  updateCategory(data: any): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'Products/UpdateCategory',
      data
    );
  }

  updateProductLine(data: any): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'Products/UpdateProductLine',
      data
    );
  }

  updateProduct(data: any): Observable<any> {
    return this.httpClient.post(
      environment.baseURL + 'Products/UpdateProduct',
      data
    );
  }



  // Product Images
  // Image
  public uploadImage(image: File, partLinkId: any) {
    const formData = new FormData();
    formData.append('image', image);
    return this.httpClient.post(
      environment.baseURL + 'ProductImages/PostProductImage?partLinkId=' + partLinkId,
      formData
    );
  }

  public GetProductImages(partLinkId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'ProductImages/GetProductImages?partLinkId=' + partLinkId)
      .pipe(catchError(this.handleError));
  }

  public AddProductImages(paramData) {
    paramData.lineId = 0;
    return this.httpClient.post(
      environment.baseURL + 'ProductImages',
      paramData
    );
  }

  public UpdateProductImages(paramData: any) {
    return this.httpClient.put(
      environment.baseURL + 'ProductImages/' + paramData.lineId,
      paramData
    );
  }

  public DeleteProductImages(id: any) {
    return this.httpClient.delete(
      environment.baseURL + 'ProductImages/' + id
    );
  }

  // Related Products

  public GetRelatedProducts(partLinkId: any, companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'ProductsRelated/GetRelatedProducts?partLinkId='
        + partLinkId + '&companyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  public AddRelatedProduct(paramData) {
    return this.httpClient.post(
      environment.baseURL + 'ProductsRelated',
      paramData
    );
  }

  public UpdateRelatedProduct(paramData: any) {
    return this.httpClient.put(
      environment.baseURL + 'ProductsRelated/' + paramData.id,
      paramData
    );
  }

  public DeleteRelatedProduct(id: any) {
    return this.httpClient.delete(
      environment.baseURL + 'ProductsRelated/' + id
    );
  }

  // Settings
  public UpdateHeader(paramData: any) {
    return this.httpClient.put(
      environment.baseURL + 'HeaderandFooters/' + paramData.id,
      paramData
    );
  }


  public AddSalesPerson(paramData) {
    paramData.contactId = 0;
    return this.httpClient.post(
      environment.baseURL + 'SalesPersons',
      paramData
    );
  }

  public UpdateSalesPerson(paramData: any) {
    return this.httpClient.put(
      environment.baseURL + 'SalesPersons/' + paramData.salesPersonId,
      paramData
    );
  }

  public DeleteSalesPersons(id: any) {
    return this.httpClient.delete(
      environment.baseURL + 'SalesPersons/' + id
    );
  }

  public AddSalesCommission(paramData) {
    paramData.id = 0;
    return this.httpClient.post(
      environment.baseURL + 'SalesCommissions',
      paramData
    );
  }

  public UpdateSalesCommission(paramData: any) {
    return this.httpClient.put(
      environment.baseURL + 'SalesCommissions/' + paramData.id,
      paramData
    );
  }

  public DeleteSalesCommission(id: any) {
    return this.httpClient.delete(
      environment.baseURL + 'SalesCommissions/' + id
    );
  }

  public AddDeliveryMode(paramData) {
    paramData.id = 0;
    return this.httpClient.post(
      environment.baseURL + 'DeliveryModes',
      paramData
    );
  }

  public UpdateDeliveryMode(paramData: any) {
    return this.httpClient.put(
      environment.baseURL + 'DeliveryModes/' + paramData.deliveryModeId,
      paramData
    );
  }

  public DeleteDeliveryMode(id: any) {
    return this.httpClient.delete(
      environment.baseURL + 'DeliveryModes/' + id
    );
  }

  // Shipping Zone
  public AddShippingZone(paramData) {
    paramData.id = 0;
    return this.httpClient.post(
      environment.baseURL + 'ShippingZones',
      paramData
    );
  }

  public UpdateShippingZone(paramData: any) {
    return this.httpClient.put(
      environment.baseURL + 'ShippingZones/' + paramData.shippingZoneId,
      paramData
    );
  }

  public DeleteShippingZone(id: any) {
    return this.httpClient.delete(
      environment.baseURL + 'ShippingZones/' + id
    );
  }

  // Provinces
  public AddProvince(paramData) {
    paramData.id = 0;
    return this.httpClient.post(
      environment.baseURL + 'Provinces',
      paramData
    );
  }

  public UpdateProvince(paramData: any) {
    return this.httpClient.put(
      environment.baseURL + 'Provinces/' + paramData.provinceId,
      paramData
    );
  }

  public DeleteProvince(id: any) {
    return this.httpClient.delete(
      environment.baseURL + 'Provinces/' + id
    );
  }

  // Charge Type
  public AddChargeType(paramData) {
    paramData.id = 0;
    return this.httpClient.post(
      environment.baseURL + 'ClientChargeTypes',
      paramData
    );
  }

  public UpdateChargeType(paramData: any) {
    return this.httpClient.put(
      environment.baseURL + 'ClientChargeTypes/' + paramData.chargeTypeId,
      paramData
    );
  }

  public DeleteChargeType(id: any) {
    return this.httpClient.delete(
      environment.baseURL + 'ClientChargeTypes/' + id
    );
  }

  // Payment Type
  public AddPaymentType(paramData) {
    paramData.id = 0;
    return this.httpClient.post(
      environment.baseURL + 'ClientPaymentTypes',
      paramData
    );
  }

  public UpdatePaymentType(paramData: any) {
    return this.httpClient.put(
      environment.baseURL + 'ClientPaymentTypes/' + paramData.paymentTypeId,
      paramData
    );
  }

  public DeletePaymentType(id: any) {
    return this.httpClient.delete(
      environment.baseURL + 'ClientPaymentTypes/' + id
    );
  }

  //Alerts
  public GetAlerts(userId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'ClientNotes/GetAlerts?userId=' + userId)
      .pipe(catchError(this.handleError));
  }

  // Client Notes
  public GetClientNotes(accountId: any, noteTypeId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'ClientNotes/GetClientNotesForAccount?accountId='
        + accountId + '&noteTypeId=' + noteTypeId)
      .pipe(catchError(this.handleError));
  }

  public GetClientStatics(): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'ClientNotes/GetNoteStatics')
      .pipe(catchError(this.handleError));
  }

  public AddClientNote(paramData) {
    paramData.id = 0;
    return this.httpClient.post(
      environment.baseURL + 'ClientNotes',
      paramData
    );
  }

  public UpdateClientNote(paramData: any) {
    return this.httpClient.put(
      environment.baseURL + 'ClientNotes/' + paramData.id,
      paramData
    );
  }

  public DeleteClientNote(id: any) {
    return this.httpClient.delete(
      environment.baseURL + 'ClientNotes/' + id
    );
  }

  //Transactions
  public GetClientTransactions(accountId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Clients/GetClientTransactions?accountId=' + accountId)
      .pipe(catchError(this.handleError));
  }

  // Reports
  public getReports(): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Reports/GetReports')
      .pipe(catchError(this.handleError));
  }

  public getSalesManagementDash(salesPersonId: any, startDate: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'SalesPersons/GetSalesPersonSummary?salesPersonId=' + salesPersonId + '&startDate=' + startDate)
      .pipe(catchError(this.handleError));
  }

  public getSalesCommReport(startDate: any, companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Reports/GetSalesCommReport?startDate=' + startDate
        + '&companyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  public getInvoicesReport(startDate: any, endDate: any, companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Reports/GetInvoicesReport?startDate=' + startDate
        + '&endDate=' + endDate + '&companyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  public getDispatchLogReport(reportDate: any, companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Reports/GetDispatchLogReport?reportDate=' + reportDate
        + '&companyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  public getSalesByLineReport(startDate: any, endDate: any, companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Reports/GetSalesByLineReport?startDate=' + startDate
        + '&endDate=' + endDate + '&companyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  public getDispatchSummaryReport(reportDate: any, companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Reports/GetDispatchSummaryReport?startDate=' + reportDate + '&companyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  public getSalesByMonthReport(startDate: any, endDate: any, companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Reports/GetSalesByMonthReport?startDate=' + startDate
        + '&endDate=' + endDate + '&companyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  public getBackOrderedReport(startDate: any, endDate: any, companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Reports/GetBackOrderReport?startDate=' + startDate
        + '&endDate=' + endDate + '&companyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  public getPaymentsReport(startDate: any, endDate: any, companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Reports/GetPaymentsReport?startDate=' + startDate
        + '&endDate=' + endDate + '&companyId=' + companyId)
      .pipe(catchError(this.handleError));
  }

  public getPaymentsReportByUser(repDate: any, userId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Reports/GetPaymentsByUser?repDate=' + repDate + '&userId=' + userId)
      .pipe(catchError(this.handleError));
  }

  public getClientPaymentsReport(accountId: any, startDate: any, endDate: any, companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Reports/GetPaymentsSummaryForAccount?companyId=' + companyId +  '&accountId=' + accountId + '&startDate=' + startDate
        + '&endDate=' + endDate)
      .pipe(catchError(this.handleError));
  }

  //StatementDashboard
  public getClientBalanceSummary(companyId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'Clients/GetClientBalanceSummary?companyId=' + companyId)
      .pipe(catchError(this.handleError));
  }


  //Login Profiles and Roles for Security
  public getLoginRoles(companyId: any, status: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'LoginProfiles/GetLoginRoles?companyId=' + companyId + '&status=' + status)
      .pipe(catchError(this.handleError));
  }

  public getSalesPeople(countryId: any): Observable<any> {
    return this.httpClient
      .get(environment.baseURL + 'SalesPersons/GetSalesPeople?countryId=' + countryId)
      .pipe(catchError(this.handleError));
  }

  public AddLogin(paramData) {
    return this.httpClient.post(
      environment.baseURL + 'LoginProfiles',
      paramData
    );
  }

  public UpdateLogin(paramData: any) {
    return this.httpClient.put(
      environment.baseURL + 'LoginProfiles/' + paramData.id,
      paramData
    );
  }

  public DeleteLogin(Id: any) {
    return this.httpClient.delete(
      environment.baseURL + 'LoginProfiles/' + Id
    );
  }

  public UpdateUserMap(paramData: any) {
    return this.httpClient.post(
      environment.baseURL + 'LoginProfiles/UpdateUserMap/', paramData
    );
  }

  public UpdateUserRole(paramData: any) {
    return this.httpClient.post(
      environment.baseURL + 'LoginProfiles/UpdateUserRole/', paramData
    );
  }

 //Purchase Orders
 public getOpenPurchaseOrders(companyId: any): Observable<any> {
  return this.httpClient
    .get(environment.baseURL + 'PurchaseOrders/GetOpenPurchaseOrders?companyId=' + companyId)
    .pipe(catchError(this.handleError));
}

public getPurchaseOrderItems(poId: any,companyId: any): Observable<any> {
  return this.httpClient
    .get(environment.baseURL + 'PurchaseOrders/GetPoItems?poId=' + poId + '&companyId=' + companyId)
    .pipe(catchError(this.handleError));
}

assignQuote(params): Observable<any> {
  return this.httpClient.post(
    environment.baseURL + 'InvoiceHdrs/AssignQuote',
    params
  );
}

}
