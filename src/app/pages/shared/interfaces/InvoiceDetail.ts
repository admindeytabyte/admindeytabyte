export class InvoiceDetail {
    invoiceId: number;
    invoiceDtlid: number;
    discountMapId: number;
    discountMapText: string;
    sequenceId: number;
    partLinkId: number;
    category: string;
    line: string;
    unit: string;
    sku: string;
    description: string;
    orderQty: number;
    sell: number;
    jobber: number;
    cost: number;
    defSell: number;
    priceModifiedBy: string;
    margin: number;
    amount: number;
    addedBy: string;
    detStatus: string;
    detStatusCde: string;
    percDiscount: number;
    inStockQty: number;
    discountText: string;
    assemblyInfo: string;
    isAssembled: boolean;
    quantityBreaks: any[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
