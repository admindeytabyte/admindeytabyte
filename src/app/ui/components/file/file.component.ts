import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tc-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class TCFileComponent implements OnInit {
  @Input() title: string;
  @Input() type: string;
  @Input() image: string;
  @Input() size: string;
  @Input() delete: boolean;
  @Input() spinner: boolean;
  @Input() link: any;

  constructor() {
    this.title = 'no-name';
    this.type = '*';
    this.image = '';
    this.size = 'normal';
    this.delete = false;
    this.spinner = false;
    this.link = false;
  }

  ngOnInit() {}
}
