import { Component, HostBinding, OnInit } from '@angular/core';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @HostBinding('class') get class() {
    return 'app-footer';
  }
  version: string;
  currentYear: number;

  constructor() {
    this.version = environment.version;
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit() {}
}
