import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-quantity-breaks',
  templateUrl: './quantity-breaks.component.html',
  styleUrls: ['./quantity-breaks.component.scss']
})
export class QuantityBreaksComponent implements OnInit {
  @Input() quantityBreaks: any[];
  @Input() height: any;
  constructor() { }

  ngOnInit() {
    if (this.height === undefined) {
      this.height = 200;
    }
  }
}
