import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { MenuItem } from '../../../interfaces/menu';
import { HttpService } from '../../../services/http/http.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    trigger(
      'subMenu',
      [
        state('active', style({
          height: '*',
          visibility: 'visible'
        })),
        state('inactive', style({
          height: 0,
          visibility: 'hidden'
        })),
        transition('inactive => active', animate('200ms ease-in-out')),
        transition('active => inactive', animate('200ms ease-in-out'))
      ]
    )
  ]
})
export class MenuComponent implements OnInit {
  @HostBinding('class') get class() {
    return 'app-menu';
  }

  @Input() src: string;

  menuItems: MenuItem[];

  constructor(
    private httpSv: HttpService,
    private router: Router
  ) {
    this.menuItems = [];
    this.src = '';
  }

  ngOnInit(): void {
    this.getMenuItems(this.src);
  }

  getMenuItems(src: string) {
		this.httpSv.getData(src).subscribe(
      data => {
        this.menuItems = data

        let urlArr = this.router.url.split('/').filter(Boolean);
        let lastUrlPm = [...urlArr].pop();

        if (lastUrlPm) {
          this.menuItems.forEach(item => {
            if (item.sub && item.sub.length) {
              item.active = item.sub.findIndex(el => el.routing === lastUrlPm) >= 0;
            }
          });
        }
      },
      err => console.error(err)
    );
  }

  getLiClasses(item: any, isActive: any) {
    return {
      'has-sub': item.sub,
      'active': item.active || isActive,
      'menu-item-group': item.groupTitle,
      'disabled': item.disabled
    };
  }
  getStyles(item: any) {
    return {
      'background': item.bg,
      'color': item.color
    };
  }

  toggle(event: Event, item: any, el: any) {
    event.preventDefault();

    const items: any[] = el.menuItems;

    if (item.active) {
      item.active = false;
    } else {
      for (let i = 0; i < items.length; i++) {
        items[i].active = false;
      }
      item.active = true;
    }
  }

  subState(item: MenuItem, rla: boolean) {
    return item.active || rla ? 'active' : 'inactive'
  }

  isActive(instruction: any[]): boolean {
    return this.router.isActive(this.router.createUrlTree(instruction), true);
  }
}
