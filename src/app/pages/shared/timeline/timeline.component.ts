import { Component, OnInit, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  @Input() align: string;
  @Input() style: any;
  @Input() data: any[];
  @HostBinding('class.tc-v-timeline') true;
  @HostBinding('class.show-years') @Input() showYears: boolean;
  @HostBinding('class.show-date') @Input() showDate: boolean;
  @HostBinding('class.align-left') get alignLeft() { return this.align === 'left' };
  @HostBinding('class.align-center') get alignCenter() { return this.align === 'center' };
  @HostBinding('class.align-right') get alignRight() { return this.align === 'right' };
  @HostBinding('class.align-between') get alignBetween() { return this.align === 'between' };


  constructor() {
    this.showYears = false;
    this.showDate = true;
    this.align = 'left';
    this.style = '';
    this.data = [];
  }

  ngOnInit() {
  }

}
