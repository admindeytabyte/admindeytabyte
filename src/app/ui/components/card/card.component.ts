import { Component, OnInit, Input, HostBinding } from '@angular/core';

@Component({
	selector: 'tc-card',
	templateUrl: './card.component.html',
	styleUrls: ['./card.component.scss']
})
export class TCCardComponent implements OnInit {
  @Input() align: string;
  @Input() title: string;
  @Input() img: string;
  @Input() padding: number;
  @Input() view: string;
  @Input() tcGradient: string[];
  @HostBinding('class') get class() {
    return 'tc-card';
  }
	@HostBinding('class.outline') @Input() outline: boolean;
	@HostBinding('class.bg-image') @Input() bgImg: string;
  @HostBinding('class.card-default') get viewDefault() { return this.view === 'default'; }
  @HostBinding('class.card-info') get viewInfo() { return this.view === 'info'; }
  @HostBinding('class.card-accent') get viewAccent() { return this.view === 'accent'; }
  @HostBinding('class.card-success') get viewSuccess() { return this.view === 'success'; }
  @HostBinding('class.card-warning') get viewWarning() { return this.view === 'warning'; }
	@HostBinding('class.card-error') get viewError() { return this.view === 'error'; }
	@HostBinding('class.text-end') get rightAlign() { return this.align === 'right'; }
	@HostBinding('class.text-center') get centerAlign() { return this.align === 'center'; }
  @HostBinding('style.backgroundImage') get bgImage() {
    return !this.tcGradient ? (this.bgImg ? `url(${this.bgImg})` : null) : this.tcGradient;
  }

	constructor() {
	  this.view = 'default';
  }

	ngOnInit() {}
}
