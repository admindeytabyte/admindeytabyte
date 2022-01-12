import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-horizontal-navbar',
  templateUrl: 'horizontal-navbar.component.html',
  styleUrls: ['horizontal-navbar.component.scss']
})
export class HorizontalNavbarComponent implements OnInit {
  @HostBinding('class') get class() {
    return 'app-h-navbar';
  }

  constructor() {}

  ngOnInit() {}
}
