import { Directive, OnInit, Input, HostBinding, HostListener, OnChanges } from '@angular/core';

@Directive({
  selector: '[tcColor]'
})
export class TCColorDirective implements OnInit, OnChanges {
  @Input() tcColor: string | string[];
  @HostBinding('class') get class() {
    return 'custom-color';
  }
  currentColor: string;
  defaultColor: string;
  hoveredColor: string;
  @HostBinding('style.color') get getStyle() {
    return this.currentColor;
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.currentColor = this.hoveredColor;
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.currentColor = this.defaultColor;
  }

  ngOnInit() {
    this.setColors();
  }

  ngOnChanges() {
    this.setColors();
  }

  setColors() {
    const color = this.tcColor;

    if (!color) {
      return null;
    }

    this.defaultColor = (typeof color === 'string') ? color : color[0];
    this.hoveredColor = (typeof color === 'string') ? color : color[1];
    this.currentColor = this.defaultColor;
  }
}
