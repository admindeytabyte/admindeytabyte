import { Component, OnInit, Input } from '@angular/core';
import { Breadcrumb } from '../../interfaces/breadcrumbs';

@Component({
  selector: 'tc-breadcrumb',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class TCBreadcrumbComponent implements OnInit {
  @Input() menu: Breadcrumb[];
  @Input() separator: string;
  @Input() style: string; // custom1 | custom2

  constructor() {
    this.menu = [];
    this.separator = '/';
    this.style = 'default';
  }

  ngOnInit() {}

  getClasses() {
    return {
      'custom-1': this.style === 'custom1',
      'custom-2': this.style === 'custom2'
    };
  }
}
