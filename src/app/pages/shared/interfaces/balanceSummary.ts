export class BalanceSummary {
    invoiceType: string;
    balance: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
