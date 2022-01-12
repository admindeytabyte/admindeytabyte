export class DailyStat {
    date: Date;
    orderQty: number;
    runningCount: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
