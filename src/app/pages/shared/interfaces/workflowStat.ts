export class WorkflowStat {
    date: Date;
    invoiceCount: number;
    status: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
