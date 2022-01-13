export class Marker {
          location: any;
          tooltip: Tooltip;

          constructor(values: Object = {}) {
                    Object.assign(this, values);
          }
}

export class Tooltip {
          isShown: boolean;
          text: string;
}
