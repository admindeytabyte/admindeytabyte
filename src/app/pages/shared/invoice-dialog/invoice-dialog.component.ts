import { ProductBatchDialogComponent } from "./../product-batch-dialog/product-batch-dialog.component";
import { ClientContactEditorComponent } from "./../client-contact-editor/client-contact-editor.component";
import { ClientHistoryDialogComponent } from "./../client-history-dialog/client-history-dialog.component";
import { InvoicePrintDialogComponent } from "./../invoice-print-dialog/invoice-print-dialog.component";
import { ConfirmDialogComponent } from "./../confirm-dialog/confirm-dialog.component";
import { UserService } from "./../../services/user.service";
import {MAT_DIALOG_DATA, MatDialogRef,MatDialog} from "@angular/material/dialog";
import { DataService } from "../../services/data.service";
import { Component, OnInit, HostListener, Inject } from "@angular/core";
import { BalanceSummary } from "./../interfaces/balanceSummary";
import { InvoiceDetail } from "./../interfaces/InvoiceDetail";
import { ToastrService } from "ngx-toastr";
import { ProductDialogComponent } from "../product-dialog/product-dialog.component";
import { SalesDialogComponent } from "../sales-dialog/sales-dialog.component";
import { NotesDialogComponent } from "../notes-dialog/notes-dialog.component";
import { ReleaseDialogComponent } from "../release-dialog/release-dialog.component";
import { ClientDiscountsDialogComponent } from "../client-discounts-dialog/client-discounts-dialog.component";
import { PackingSlipDialogComponent } from "../packing-slip-dialog/packing-slip-dialog.component";
import { InvoiceMiniViewComponent } from "../invoice-mini-view/invoice-mini-view.component";
//import { DispatchlogEditorComponent } from "../dispatchlog-editor/dispatchlog-editor.component";
import { MessageDialogComponent } from "../message-dialog/message-dialog.component";
import { InvoiceLineEditorComponent } from "../invoice-line-editor/invoice-line-editor.component";
import { PaymentDialogComponent } from "../payment-dialog/payment-dialog.component";

@Component({
  selector: "app-invoice-dialog",
  templateUrl: "./invoice-dialog.component.html",
  styleUrls: ["./invoice-dialog.component.scss"],
})
export class InvoiceDialogComponent implements OnInit {
  screenHeight: number;
  screenWidth: number;
  SaveText: string;
  dispatchNum: string;
  invoice: any;
  deliveryLog: any;
  client: any = null;
  selectedItem: any = null;
  invoiceGridHeight = 470;
  isQuotation: boolean;
  statusSortId: number;
  isInvoice: boolean;
  isComplete: boolean;
  isEstimate: boolean;
  isAdmin: boolean = false;
  hasReturns: boolean =  false;
  dtlHistory: any[];
  purchaseHistory: any[] = [];
  billingAddress: any;
  selectedShippingAddress: any;
  selectedDelMode: any;
  shippingAddresses: any[] = [];
  deliveryModes: any[] = [];
  invoiceDetails: InvoiceDetail[] = [];
  deletedItems: InvoiceDetail[] = [];
  invoiceTypes: any[] = [];
  selInvType: any;
  productsList: any[];
  receivables: any[];
  invoiceAlert: any;
  clientStatus: any;
  holdQuote: any;
  signature: any;
  escalate: any;
  subTotal = 0;
  discount = 0;
  discountPerc = 0;
  totalMargin = 0;
  hst = 0;
  grandTotal = 0;
  creditLimit = 0;
  currentBalance = 0;
  creditAvailable = 0;
  changeCounter = 0;
  balances: BalanceSummary[] = [];
  audits: any[];
  invoiceModel: any;
  productDialogRef: MatDialogRef<ProductDialogComponent>;
  // dispatchEditorDialogRef: MatDialogRef<DispatchlogEditorComponent>;
  dialogBatchProductRef: MatDialogRef<ProductBatchDialogComponent>;
  printDialogRef: MatDialogRef<InvoicePrintDialogComponent>;
  salesDialogRef: MatDialogRef<SalesDialogComponent>;
  clientMatrixDialogRef: MatDialogRef<ClientDiscountsDialogComponent>;
  clientHistoryDialogRef: MatDialogRef<ClientHistoryDialogComponent>;
  contactDialogRef: MatDialogRef<ClientContactEditorComponent>;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  messageDialog: MatDialogRef<MessageDialogComponent>;
  confDialogRef: MatDialogRef<ConfirmDialogComponent>;
  miniInvoicedialogRef: MatDialogRef<InvoiceMiniViewComponent>;
  invoiceItemEditdialogRef: MatDialogRef<InvoiceLineEditorComponent>;
  clientPaymentDialogRef: MatDialogRef<PaymentDialogComponent>;
  errorMessage: any;
  user: any;
  notesDialogRef: MatDialogRef<NotesDialogComponent>;
  releaseDialogRef: MatDialogRef<ReleaseDialogComponent>;
  packingDialogRef: MatDialogRef<PackingSlipDialogComponent>;
  minimizedView = false;
  quantityBreaks: any[];
  loadingVisible = false;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      invoiceId: any;
    },
    private mdDialogRef: MatDialogRef<InvoiceDialogComponent>,
    private dataService: DataService,
    private toastr: ToastrService,
    private userService: UserService,
    private dialog: MatDialog
  ) {
    mdDialogRef.disableClose = true;
    this.invoiceInfo_tabClick = this.invoiceInfo_tabClick.bind(this);
    this.deleteItemClick = this.deleteItemClick.bind(this);
    this.returnItemClick = this.returnItemClick.bind(this);
    this.cloneItemClick = this.cloneItemClick.bind(this);
    this.editInvoiceClick = this.editInvoiceClick.bind(this);
    this.editItemClick = this.editItemClick.bind(this);
    //  this.getSell = this.getSell.bind(this);
  }

  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.isAdmin = this.user.isAdmin;
    
    this.loadInvoice();

    this.mdDialogRef.keydownEvents().subscribe((event) => {
      if (event.key === "Escape") {
        this.CloseClick();
      }
    });
    //this.onResize();
  }

  @HostListener("window:keydown.Control.a", ["$event"])
  onKeyDownControlA(e) {
    e.preventDefault();
    if (this.showProducts) {
      this.showProductLookup(null);
    }
  }

  @HostListener("window:resize", ["$event"])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    //this.invoiceGridHeight = this.screenHeight * .50;
  }

  @HostListener("window:keydown.f2", ["$event"])
  onKeyDownControlF2(e) {
    e.preventDefault();

    if (this.selectedItem === null || this.selectedItem === undefined) {
      return;
    }

    if (!this.checkRole(25)) {
      this.messageDialog = this.dialog.open(MessageDialogComponent, {
        data: {
          message:
            "F2 Client History for Product is not granted. Please consult your Admin",
        },
        height: "200px",
        width: "600px",
        panelClass: "my-dialog",
      });
      return;
    }

    this.displayHistory(this.selectedItem.partLinkId, "f2");
  }

  @HostListener("window:keydown.f6", ["$event"])
  onKeyDownControlF6(e) {
    e.preventDefault();
    if (!this.checkRole(26)) {
      this.messageDialog = this.dialog.open(MessageDialogComponent, {
        data: {
          message:
            "F6 History for all clients  is not granted. Please consult your Admin",
        },
        height: "200px",
        width: "600px",
        panelClass: "my-dialog",
      });
      return;
    }

    if (this.selectedItem === null || this.selectedItem === undefined) {
      return;
    }
    this.displayHistory(this.selectedItem.partLinkId, "f6");
  }

  onKeyDown(e) {
    if (this.selectedItem === null || this.selectedItem === undefined) {
      return;
    }
    if (e.event.key === "F2") {
      if (!this.checkRole(25)) {
        this.messageDialog = this.dialog.open(MessageDialogComponent, {
          data: {
            message:
              "F2 Client History for Product is not granted. Please consult your Admin",
          },
          height: "200px",
          width: "600px",
          panelClass: "my-dialog",
        });
        return;
      }
      this.displayHistory(this.selectedItem.partLinkId, "f2");
    }
    if (e.event.key === "F6") {
      if (!this.checkRole(26)) {
        this.messageDialog = this.dialog.open(MessageDialogComponent, {
          data: {
            message:
              "F6 History for all clients  is not granted. Please consult your Admin",
          },
          height: "200px",
          width: "600px",
          panelClass: "my-dialog",
        });
        return;
      }
      this.displayHistory(this.selectedItem.partLinkId, "f6");
    }
  }

  displayHistory(partLinkId, mode) {
    this.clientHistoryDialogRef = this.dialog.open(
      ClientHistoryDialogComponent,
      {
        data: {
          accountId: this.invoice.accountId,
          product: partLinkId,
          companyId: this.user.companyId,
          mode: mode,
          clientName: this.invoice.clientName,
        },
        height: "80%",
        width: "60%",
        panelClass: "my-dialog",
      }
    );
  }

  editInvoiceClick(e) {
    this.miniInvoicedialogRef = this.dialog.open(InvoiceMiniViewComponent, {
      data: {
        invoiceId: e.row.data.invoiceId,
      },
      height: "60%",
      width: "50%",
    });
  }

  loadInvoice() {
    // Load Invoice
    this.invoiceDetails = [];
    this.loadingVisible = true;
    this.dataService.getInvoice(this.data.invoiceId).subscribe((data) => {
      this.SaveText = "Save";
      this.invoice = data;
      this.dispatchNum = this.invoice.dispatchId;
      this.isEstimate = data.invoiceTypeCde === "C";
      this.invoiceTypes = data.invoiceTypes;
      this.selInvType = data.invoiceTypes.filter(
        (f) => f.invoiceType1 === data.invoiceTypeCde
      )[0];
      this.subTotal = this.invoice.gross;
      this.creditLimit = this.invoice.creditLimit;
      this.currentBalance = this.invoice.currentBalance;
      this.client = this.invoice.client;
      this.deliveryLog = this.invoice.deliveryLog;
      this.isComplete = this.invoice.isComplete;
      this.statusSortId = this.invoice.statusSortId;
      this.shippingAddresses = this.invoice.addresses;
      this.billingAddress = this.invoice.addresses.filter(
        (f) => f.addressTypeId === 1
      )[0];
      this.selectedShippingAddress = this.shippingAddresses.filter(
        (f) => f.addressId === this.invoice.shippingId
      )[0];
      this.deliveryModes = data.deliveryModes;
      this.selectedDelMode = this.deliveryModes.filter(
        (f) => f.deliveryModeId === data.deliveryModeId
      )[0];
      this.isQuotation = this.invoice.invoiceTypeCde === "Q" ? true : false;
      this.isInvoice = this.invoice.invoiceTypeCde !== "Q" ? true : false;
      this.audits = data.audits;
      this.discountPerc = data.discountPerc;
      this.discount = data.discount;
      this.holdQuote = data.holdQuotes;
      this.escalate = data.escalate;
      (this.invoiceAlert = this.invoice.client.alert), (this.deletedItems = []);
      // details
      this.invoice.details.forEach((item) => {
        const dtl = new InvoiceDetail({
          invoiceId: item.invoiceId,
          invoiceDtlid: item.invoiceDtlid,
          sequenceId: item.sequenceId,
          partLinkId: item.partLinkId,
          line: item.line,
          sku: item.sku,
          description: item.description,
          orderQty: item.orderQty,
          sell: item.sell,
          priceModifiedBy: item.priceModifiedBy,
          defSell: item.defPrice,
          cost: item.cost,
          amount: item.amount,
          unit: item.unit,
          detStatusCde: item.detStatusCde,
          addedBy: item.addedBy,
          addedById: item.addedById,
          detStatus: "O",
          category: item.category,
          discountMapId: item.discountMapId,
          percDiscount: item.percDiscount === null ? 0 : item.percDiscount,
          discountText: item.discountText,
          assemblyInfo: item.assemblyInfo,
          isAssembled: item.isAssembled,
          inStockQty: item.inStockQty,
          quantityBreaks: item.quauntityBreaks,
          
        });
        if (this.invoice.client.houseAccount === true) {
          dtl.cost = 0;
          dtl.sell = 0;
          dtl.amount = 0;
        }
        this.invoiceDetails.push(dtl);
      });

      this.loadingVisible = false;
      this.calcTotals();
      this.changeCounter = 0;
      this.hasReturns = this.invoiceDetails.filter((item) => item.detStatusCde === 'R').length>0; 

      if (this.user.usedId='SYS'){
        this.errorMessage = this.invoice.invoiceId;
      }

      // this.showClientMatrix(null);
      //this.showProductLookup(null);
      // this.printInvoice();
      //this.showProductBatchLookup(null);
      // this.displayHistory(this.invoiceDetails[0].partLinkId, 'f2');
    });
  }

  formatImage(img: any): any {
    return "data:image/jpeg;base64," + img;
  }

  onDetailsGridToolbarPreparing(e) {
    e.toolbarOptions.items.unshift(
      // {
      //   location: 'before',
      //   template: 'invoiceAlert',
      // },
      // {
      //   location: "before",
      //   widget: "dxButton",
      //   options: {
      //     text: "Assign To Tas",
      //     visible: this.showAssign(),
      //     width: 200,
      //     onClick: this.assignQuote.bind(this),
      //   },
      // },
      {
        location: "after",
        widget: "dxCheckBox",
        options: {
          text: "Minimized",
          hint: "Minimized",
          visible: this.checkRole(12),
          width: 150,
          class: "gridPanelControl",
          onValueChanged: this.applyMinimizedFilter.bind(this),
        },
      },
      {
        location: "after",
        widget: "dxButton",
        options: {
          icon: "search",
          visible: this.showProducts(),
          hint: "Product Search",
          onClick: this.showProductLookup.bind(this),
        },
      },
      {
        location: "after",
        widget: "dxButton",
        options: {
          icon: "bulletlist",
          visible: this.showProducts(),
          hint: "Product Batch Entry",
          onClick: this.showProductBatchLookup.bind(this),
        },
      },
      {
        location: "after",
        widget: "dxButton",
        options: {
          icon: "comment",
          hint: "Notes",
          onClick: this.showNotes.bind(this),
        },
      },
      {
        location: "after",
        widget: "dxButton",
        options: {
          icon: "fa fa-address-card-o",
          hint: "Contacts",
          onClick: this.showContacts.bind(this),
        },
      },
      {
        location: "after",
        widget: "dxButton",
        options: {
          icon: "chart",
          visible: this.checkRole(11),
          hint: "Sales Analysis",
          onClick: this.showSales.bind(this),
        },
      },
      {
        location: "after",
        hint: "Price Matrix",
        widget: "dxButton",
        options: {
          icon: "formula",
          visible: this.checkRole(63),
          onClick: this.showClientMatrix.bind(this),
        }
      },
      {
        location: "after",
        hint: "Packing Slip",
        widget: "dxButton",
        options: {
          icon: "fa fa-file-text-o",
          visible: this.checkRole(66) && this.isInvoice,
          onClick: this.openPackingSlipClick.bind(this),
        }
      },
      {
        location: "after",
        hint: "Print",
        widget: "dxButton",
        options: {
          icon: "print",
          visible: this.canPrint(),
          onClick: this.printInvoice.bind(this),
        }
      },
      {
        location: "after",
        hint: "Close on Acount",
        widget: "dxButton",
        options: {
          icon: "fa fa-file",
          visible: this.checkRole(3) && this.isInvoice && this.statusSortId <15,
          onClick: this.closeInvoiceClick.bind(this),
        }
      },
      {
        location: "after",
        hint: "Make Payment",
        widget: "dxButton",
        options: {
          icon: "money",
          visible: this.checkRole(3) && this.isInvoice && this.statusSortId <16,
          onClick: this.payInvoiceClick.bind(this),
        }
      }
    );
  }

  showAssign(){
    if (this.isInvoice){
      return false;
    }
    if (this.invoice.loggedBy == 'Tas'){
      return false;
    }
    return true;
  }

  assignQuote(){
    const assignModel = {
      invoiceId: this.invoice.invoiceId,
      assignedById: this.user.id,
      assignedToId: 2
    }

    this.dataService.assignQuote(assignModel).subscribe(data => {
      this.toastr.success('Success', 'PaintCity Inc', { timeOut: 1000 });
      this.errorMessage = null;
      this.mdDialogRef.close(true);
    },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Failed');
      });
  }

 
  showProducts() {
    if (this.isAdmin) return true;

    if (this.userService.checkRole(29) === false) {
      return false;
    }
    return this.statusSortId < 10;
  }

  checkRole(roleId: any) {
    return this.userService.checkRole(roleId);
  }

  canPrint(){
    if (this.user.isAdmin){
      return true;
    }
    return this.userService.checkRole(66) && this.isInvoice;

  }

  applyMinimizedFilter(e) {
    this.minimizedView = e.value;
  }

  allowEditCheck(data: any) {
    if (this.isAdmin) return true;

    if (this.checkRole(28) === true) {
      return true;
    }

    return false;
  }

  editItemClick(e) {
    this.invoiceItemEditdialogRef = this.dialog.open(
      InvoiceLineEditorComponent,
      {
        data: {
          invoiceItem: e.row.data,
        },
        height: "20%",
        width: "60%",
      }
    );

    this.invoiceItemEditdialogRef.afterClosed().subscribe(() => {
      //this.calcTotals();
      this.saveInvoice(false);
    });
  }

  closeInvoiceClick(e) {
    this.confDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Confirm",
        message: "Do you want to Close the Invoice without a Payment?",
      },
      height: "200px",
      width: "600px",
      panelClass: "my-dialog",
    });

    const sub = this.confDialogRef.componentInstance.confirmEvent.subscribe(
      (data) => {
        if (data === true) {
          // Close Invoice without Payment
          let inputs = {
            accountId: this.invoice.accountId,
            invoiceId: this.invoice.invoiceId,
            updateUserId: this.user.id,
            updateUser: this.user.userName
          };
          this.dataService.closeInvoice(inputs).subscribe(
            (res) => {
              this.toastr.success("Closed on Account", "PaintCity Inc", {
                timeOut: 3000,
              });
              this.loadInvoice();
            },
            (error) => {
              this.errorMessage = error.error;
              this.toastr.error("Failed");
            }
          );
        }
      }
    );

    this.confDialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  payInvoiceClick(e) {
    this.clientPaymentDialogRef = this.dialog.open(PaymentDialogComponent, {
      data: {
        accountId: this.invoice.accountId,
        invoiceId: this.invoice.invoiceId
      },
      height: '40%',
      width: '50%',
      panelClass: 'my-dialog'
    });

    this.clientPaymentDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadInvoice();
      }
    });

  }

  onCellPrepared(e) {
    if (e.rowType === "data" && e.column.dataField === "orderQty") {
      e.cellElement.style.color = e.data.orderQty >= 0 ? "black" : "red";
    }

    if (e.rowType === "data" && e.column.dataField === "inStockQty") {
      e.cellElement.style.color = e.data.inStockQty >= 0 ? "black" : "red";
    }

    if (e.rowType === "data" && e.column.dataField === undefined) {
      e.cellElement.style.color = e.data.orderQty >= 0 ? "black" : "red";
    }

    if (e.rowType === "data" && e.column.type === "buttons") {
      if (e.column.buttons[0].hint === "EditItem") {
        if (e.data.isAssembled == true) {
          e.cellElement.style.visibility = "hidden";
        }
        if (e.data.detStatusCde === "R") {
          e.cellElement.style.visibility = "hidden";
        }
      }

      if (e.column.buttons[0].hint === "Return") {
        if (e.data.detStatusCde === "R") {
          e.cellElement.style.visibility = "hidden";
        }
      }

      if (e.column.buttons[0].hint === "IDelete") {
        if (e.data.detStatusCde != "R") {
          e.cellElement.style.visibility = "hidden";
        }
      }

      

      

      // if (e.column.buttons[0].hint === 'Delete' && this.isInvoice)
      // {
      //   e.cellElement.style.display = 'none';
      //   if (this.deleteVisible(e.data) === true){
      //     e.cellElement.style.display = 'block';
      //   }
      // }
    }
  }

  buildAlert() {
    // if (this.invoice.invoiceTypeCde !== 'Q') { return; }
    // if (Number(this.creditAvailable) < 0) {
    //   this.invoiceAlert = 'Alert: Please advice client of being overlimit, and log response in clients Notes';
    // }
  }

  setChangeCounter() {
    this.changeCounter = this.changeCounter + 1;
    this.SaveText = "Save(" + this.changeCounter + ")";
  }

  buildInvoiceModel(convertType: string) {
    this.invoiceModel = {
      invoiceId: this.invoice.invoiceId,
      // invoiceTypeCde: this.selInvType !== null ? this.selInvType : 'Q',
      details: this.invoiceDetails,
      deletedItems: this.deletedItems,
      delInstructions: this.invoice.deliveryInstructions,
      invoiceNotes: this.invoice.notes,
      delDate: this.invoice.deliveryDate,
      invoiceStatusCde: this.invoice.invoiceStatusCde,
      clientPo: this.invoice.clientPo,
      shippingId:
        this.selectedShippingAddress !== undefined
          ? this.selectedShippingAddress.addressId
          : 0,
      DeliveryModeId: this.selectedDelMode.deliveryModeId,
      updateUser: this.user.userId,
      createdById: this.user.id,
      companyId: this.user.companyId,
      convertType: convertType !== undefined ? convertType : "Q",
      discount: this.discount,
      discountPerc: this.discountPerc,
    };
  }

  SetQuoteCompleteClick() {
    this.invoice.invoiceStatusCde = "E";
    this.invoice.isComplete = true;
    this.saveInvoice(false);
  }

  convertQuote(invoiceType) {
    this.buildInvoiceModel(invoiceType);
    this.invoiceModel.invoiceStatusCde = "T";
    this.dataService.convertQuotation(this.invoiceModel).subscribe(
      (data) => {
        this.changeCounter = 0;
        this.loadInvoice();
        this.toastr.success("Conversion Complete", "PaintCity Inc", {
          timeOut: 3000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error("Invoice Conversion Failed");
        this.loadInvoice();
      }
    );
  }

  CreateInvoiceClick() {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Convert Confirmation",
        message: "Do you want to convert this Quotation as an Invoice?",
      },
      height: "150px",
      width: "600px",
      panelClass: "my-dialog",
    });

    const sub = this.confirmDialogRef.componentInstance.confirmEvent.subscribe(
      (data) => {
        // Convert to Invoice
        if (data === true) {
          this.convertQuote("I");
        }
      }
    );

    this.confirmDialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  CreateEstimateClick() {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Convert Confirmation",
        message: "Do you want to convert this Quotation as an Estimate?",
      },
      height: "200px",
      width: "600px",
      panelClass: "my-dialog",
    });

    const sub = this.confirmDialogRef.componentInstance.confirmEvent.subscribe(
      (data) => {
        // Convert to Invoice
        if (data === true) {
          this.convertQuote("C");
        }
      }
    );

    this.confirmDialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  ConvertEstimateClick() {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Convert Confirmation",
        message: "Do you want to convert this Estimate as an Invoice?",
      },
      height: "200px",
      width: "600px",
      panelClass: "my-dialog",
    });

    const sub = this.confirmDialogRef.componentInstance.confirmEvent.subscribe(
      (data) => {
        // Convert to Invoice
        if (data === true) {
          this.dataService.convertEstimate(this.invoice.invoiceId).subscribe(
            (data) => {
              this.loadInvoice();
              this.toastr.success("Conversion Complete", "PaintCity Inc", {
                timeOut: 3000,
              });
            },
            (error) => {
              this.errorMessage = error.error;
              this.toastr.error("Estimate Conversion Failed");
              this.loadInvoice();
            }
          );
        }
      }
    );

    this.confirmDialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  VoidInvoiceClick() {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Void Confirmation",
        message: "Do you want to Void This Invoice",
      },
      height: "200px",
      width: "600px",
      panelClass: "my-dialog",
    });

    const sub = this.confirmDialogRef.componentInstance.confirmEvent.subscribe(
      (data) => {
        if (data === true) {
          // Vodid Invoice
          this.dataService
            .voidInvoice(this.invoice.invoiceId, this.user.id)
            .subscribe(
              (data) => {
                this.loadInvoice();
                this.toastr.success(
                  "Invoice has been Voided",
                  "PaintCity Inc",
                  { timeOut: 3000 }
                );
              },
              (error) => {
                this.errorMessage = error.error;
                this.toastr.error("Void Failed");
                this.loadInvoice();
              }
            );
        }
      }
    );

    this.confirmDialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  setBackOrderClick() {
    this.invoice.invoiceStatusCde = "B";
    this.saveInvoice(false);
  }

  PutOnHoldClick() {
    this.invoice.invoiceStatusCde = "H";
    this.saveInvoice(false);
  }

  // openLog() {
  //   this.dispatchEditorDialogRef = this.dialog.open(DispatchlogEditorComponent, {
  //     data: {
  //       dispatchNum: this.invoice.dispatchId
  //     },
  //     height: '70%',
  //     width: '60%'
  //   });
  // }

  saveInvoice(action) {
    //Check for all Qtys to be 0

    this.buildInvoiceModel(
      this.selInvType !== undefined ? this.selInvType.invoiceType1 : "Q"
    );
    this.dataService.updateInvoice(this.invoiceModel).subscribe(
      (data) => {
        this.changeCounter = 0;
        if (action === true) {
          this.close(true);
        } else {
          this.toastr.success("Update Success", "PaintCity Inc", {
            timeOut: 1000,
          });
          this.loadInvoice();
        }
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error("Invoice Save Failed");
        // this.loadInvoice();
      }
    );
  }

  deleteInvoice() {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Delete Confirmation",
        message: "Do you want to Delete this Quotation?",
      },
      height: "200px",
      width: "600px",
      panelClass: "my-dialog",
    });

    const sub = this.confirmDialogRef.componentInstance.confirmEvent.subscribe(
      (data) => {
        if (data === true) {
          this.dataService.deleteInvoice(this.invoice.invoiceId).subscribe(
            (response) => {
              this.toastr.success(
                "Quotation Deleted Successfully!",
                "Success",
                {
                  timeOut: 3000,
                }
              );
              this.mdDialogRef.close(false);
            },
            (error) => {
              this.errorMessage = error.error;
              this.toastr.error("Quotation Delete Failed ");
            }
          );
        }
      }
    );

    this.confirmDialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  showNotes(e) {
    this.notesDialogRef = this.dialog.open(NotesDialogComponent, {
      data: {
        accountId: this.invoice.accountId,
      },
      height: this.screenHeight * 0.6 + "px",
      width: this.screenWidth * 0.5 + "px",
      panelClass: "my-dialog",
    });
  }

  showSales(e) {
    this.salesDialogRef = this.dialog.open(SalesDialogComponent, {
      data: {
        accountId: this.invoice?.accountId,
      },
      height: "70%",
      width: "60%",
    });
  }

  showClientMatrix(e) {
    this.clientMatrixDialogRef = this.dialog.open(
      ClientDiscountsDialogComponent,
      {
        data: {
          accountId: this.invoice?.accountId,
          isJobber: this.invoice?.client.isaJobber,
        },
        height: "70%",
        width: "70%",
      }
    );
  }

  ReleaseClick() {
    this.releaseDialogRef = this.dialog.open(ReleaseDialogComponent, {
      data: {
        invoiceId: this.invoice.invoiceId,
      },
      height: "80%",
      width: "70%",
      panelClass: "my-dialog",
    });

    this.releaseDialogRef.afterClosed().subscribe(() => {
      this.mdDialogRef.close(true);
    });
  }

  showContacts(e) {
    this.contactDialogRef = this.dialog.open(ClientContactEditorComponent, {
      disableClose: true,
      data: {
        accountId: this.invoice?.accountId,
      },
      height: "50%",
      width: "50%",
      panelClass: "my-dialog",
    });
  }

  showProductLookup(e) {
    //this.saveInvoice(false);

    this.productDialogRef = this.dialog.open(ProductDialogComponent, {
      disableClose: true,
      data: {
        invoiceId: this.invoice?.invoiceId,
        accountId: this.invoice?.accountId,
        isJobber: this.invoice?.client.isaJobber,
        parentType: "invoice",
        clientName: this.invoice?.clientName,
      },
      height: this.screenHeight + "px",
      width: this.screenWidth + "px",
      //panelClass: 'my-dialog'
    });

    const sub =
      this.productDialogRef.componentInstance.selectProductEvent.subscribe(
        (data) => {
          this.productSelected(data);
        }
      );

    this.productDialogRef.afterClosed().subscribe(() => {
      //this.onResize();
      //this.saveInvoice(false);
      sub.unsubscribe();
    });
  }

  showProductBatchLookup(e) {
    this.dialogBatchProductRef = this.dialog.open(ProductBatchDialogComponent, {
      data: {
        invoiceId: this.invoice?.invoiceId,
        accountId: this.invoice?.accountId,
        isJobber: this.invoice?.client.isaJobber,
        clientName: this.invoice?.clientName,
      },
      height: "85%",
      width: "80%",
      panelClass: "my-dialog",
    });

    const sub =
      this.dialogBatchProductRef.componentInstance.addProductsEvent.subscribe(
        (data) => {
          data.forEach((item) => {
            if (item.message === "OK") {
              this.productSelected(item);
            }
          });
        }
      );

    this.dialogBatchProductRef.afterClosed().subscribe(() => {
      this.saveInvoice(false);
      sub.unsubscribe();
    });
  }

  openPackingSlipClick(e) {
    this.packingDialogRef = this.dialog.open(PackingSlipDialogComponent, {
      data: {
        invoiceId: this.invoice.invoiceId,
      },
      height: "95%",
      width: "50%",
      panelClass: "my-dialog",
    });
  }

  printInvoice() {
    // this.buildInvoiceModel(this.selInvType !== undefined ? this.selInvType.invoiceType1 : 'Q');
    this.printDialogRef = this.dialog.open(InvoicePrintDialogComponent, {
      data: {
        invoice: this.invoice,
      },
      height: "95%",
      width: "50%",
      panelClass: "my-dialog",
    });
  }

  invoiceInfo_tabClick(e) {
    if (e.itemIndex === 1) {
      this.balances = [];
      this.balances.push(
        new BalanceSummary({
          invoiceType: "Limit",
          balance: this.creditLimit,
        })
      );

      this.dataService
        .getReceivables(this.invoice.accountId)
        .subscribe((data) => {
          this.receivables = data.filter((item) => item.balance > 0.1);

          const summary = new Map<string, number>();
          for (const { invoiceType, balance } of this.receivables) {
            summary.set(invoiceType, (summary.get(invoiceType) || 0) + balance);
          }

          summary.forEach((value, key) => {
            const s = new BalanceSummary({
              invoiceType: key,
              balance: value,
            });
            this.balances.push(s);
          });

          this.balances.push(
            new BalanceSummary({
              invoiceType: "Total",
              balance: this.currentBalance,
            })
          );
        });
    }
  }

  customizeBalanceTooltip = (pointsInfo) => {
    // tslint:disable-next-line: radix
    return { text: parseInt(pointsInfo.originalValue) + "%" };
  };

  calcDiscount = (dtl: InvoiceDetail) => (dtl.percDiscount / 100) * dtl.sell;
  calcSell = (dtl: InvoiceDetail) =>
    dtl.sell - dtl.sell * (dtl.percDiscount / 100);
  getAmount = (dtl: InvoiceDetail) => dtl.orderQty * this.calcSell(dtl);
  margin = (dtl: InvoiceDetail) =>
    (this.calcSell(dtl) - dtl.cost) * dtl.orderQty;

  calcTotals() {
    this.subTotal = 0;
    this.totalMargin = 0;
    this.invoiceDetails.forEach(
      (dtl) => (this.subTotal += dtl.orderQty * this.calcSell(dtl))
    );
    this.invoiceDetails.forEach(
      (dtl) =>
        (this.totalMargin += dtl.orderQty * (this.calcSell(dtl) - dtl.cost))
    );
    this.discount = (this.subTotal * this.discountPerc) / 100;
    this.totalMargin = this.totalMargin - this.discount;
    this.hst = (this.subTotal - this.discount) * (this.invoice.taxRate / 100);
    this.grandTotal = this.subTotal - this.discount + this.hst;
    this.creditAvailable =
      this.creditLimit - (this.currentBalance + this.grandTotal);
    this.invoice.creditAvailable = this.creditAvailable;
    this.invoice.details = this.invoiceDetails;
    this.buildAlert();
  }

  invoiceSelectionChanged(e) {
    if (e.rowIndex >= 0) {
      this.selectedItem = e.row.data;
      this.quantityBreaks = this.selectedItem.quantityBreaks;
      this.dtlHistory = this.purchaseHistory.filter(
        (item) => item.partLinkId === this.selectedItem.partLinkId
      );
      if (this.dtlHistory.length === 0) {
        this.dataService
          .getRecentHistory(
            this.invoice.accountId,
            this.invoice.invoiceId,
            this.selectedItem.partLinkId
          )
          .subscribe((data) => {
            this.dtlHistory = data;
            data.forEach((dtl: any) => {
              this.purchaseHistory.push(dtl);
            });
          });
      }
    }
  }

  detailsUpdated(e) {
    e.data.detStatus = "E";
    e.data.addedBy = this.user.userId;
    e.data.addedById = Number(this.user.id);
    //this.changeCounter = this.changeCounter + 1;
    this.setChangeCounter();
    this.calcTotals();
  }

  productSelected(data) {
    data.forEach((e) => {
      const existingItem = this.invoiceDetails.filter(
        (item) => item.partLinkId === e.id
      )[0];

      if (this.invoice.invoiceStatusCde === "W") {
        this.invoice.invoiceStatusCde = "I";
      }
      if (existingItem === null || existingItem === undefined) {
        const dtl = new InvoiceDetail({
          invoiceId: this.invoice.invoiceId,
          invoiceDtlid:
            this.invoiceDetails.length > 0
              ? Math.max.apply(
                  Math,
                  this.invoiceDetails.map(function (o) {
                    return o.invoiceDtlid;
                  })
                ) + 1
              : 1,
          sequenceId:
            this.invoiceDetails.length > 0
              ? Math.max.apply(
                  Math,
                  this.invoiceDetails.map(function (o) {
                    return o.sequenceId;
                  })
                ) + 1
              : 1,
          partLinkId: e.id,
          line: e.line,
          sku: e.sku,
          jobber: e.jobber,
          description: e.description,
          orderQty: e.orderQty,
          cost: e.cost != null ? e.cost : 0,
          sell:
            e.customSell === undefined || e.customSell == null
              ? e.sell
              : e.customSell,
          addedBy: this.user.userId,
          detStatus: "N",
          discountMapId: e.discountMapId,
          discountMapText: e.discountText,
          percDiscount: 0,
          discountText: e.discountText,
          unit: e.paintUnit,
        });
        if (this.invoice.client.houseAccount === true) {
          dtl.cost = 0;
          dtl.sell = 0;
        }
        this.invoiceDetails.push(dtl);
      } else {
        existingItem.orderQty = existingItem.orderQty + e.orderQty;
        existingItem.detStatus = "E";
      }
      this.toastr.success(
        "Added " + e.orderQty + " of " + e.description,
        "PaintCity Inc",
        { timeOut: 3000 }
      );
    });

    if (data.length > 0) {
      this.calcTotals();
      this.changeCounter = this.changeCounter + 1;
      this.setChangeCounter();
      this.saveInvoice(false);
    }
  }

  deleteItemClick(e) {
    const dtl = e.row.data;
    if (dtl.detStatus !== "N") {
      // this.loadingVisible = true;
      // Set to Delete
      dtl.detStatus = "D";
      this.deletedItems.push(dtl);
    }
    this.invoiceDetails.forEach((item, index) => {
      if (item === dtl) {
        this.invoiceDetails.splice(index, 1);
      }
    });
  }

  deleteVisible(e) {
    if (this.isQuotation === true) {
      return true;
    }

    if (e.detStatusCde === "R") {
      return true;
    }

    return false;
  }

  returnItemClick(e) {
    this.dataService.returnItem(e.row.data).subscribe(
      (response) => {
        this.loadInvoice();
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error("Failed ");
      }
    );
  }

  cloneItemClick(e) {
    //this.saveInvoice(false);

    this.dataService.cloneItem(e.row.data).subscribe(
      (response) => {
        this.loadInvoice();
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error("Failed ");
      }
    );
  }

  // getConfirmation(title: any, message: any): any {
  //   this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
  //     data: {
  //       title: title,
  //       message: message
  //     },
  //     height: '200px',
  //     width: '600px',
  //     panelClass: 'my-dialog'
  //   });

  //   const sub = this.confirmDialogRef.componentInstance.confirmEvent.subscribe((data) => {
  //     return data;
  //   });

  //   this.confirmDialogRef.afterClosed().subscribe(() => {
  //     sub.unsubscribe();
  //   });
  // }

  public cancel() {
    this.close(false);
  }

  public close(value) {
    if (this.changeCounter > 0 && value === false) {
      this.confDialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: "Confirm",
          message:
            "There are Unsaved Changes. Do you want to close without Saving?",
        },
        height: "200px",
        width: "600px",
        panelClass: "my-dialog",
      });

      const sub = this.confDialogRef.componentInstance.confirmEvent.subscribe(
        (data) => {
          if (data === true) {
            this.mdDialogRef.close(true);
          }
        }
      );

      this.confDialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
      });
    } else {
      this.mdDialogRef.close(false);
    }

    if (value === true) {
      this.saveInvoice(true);
      this.mdDialogRef.close(true);
    }
  }

  public confirm() {
    this.close(true);
  }

  @HostListener("keydown.esc")
  public onEsc() {
    this.close(false);
  }

  CloseClick() {
    this.close(false);
  }
}
