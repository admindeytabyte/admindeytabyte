import {Component, HostBinding, Input, OnInit} from '@angular/core';

@Component({
  selector: 'tc-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class TCAvatarComponent implements OnInit {
  @Input() src: string;
  @Input() initials: string;
  @Input() size: number;
  @Input() alt: string;
  @Input() badgeBg: string;
  @HostBinding('class') get class() {
    return 'tc-avatar';
  }
  @HostBinding('class.avatar-loading') @Input() loading: boolean;
  @HostBinding('class.with-badge') @Input() badge: boolean;
  @HostBinding('style.height') get height() {
    return `${this.size}px`;
  }
  @HostBinding('style.width') get width() {
    return `${this.size}px`;
  }
  @HostBinding('style.fontSize') get fontSize() {
    return `${this.size / 2}px`;
  }

  constructor() {
    this.size = 40;
    this.loading = false;
  }

  ngOnInit() { }
}
