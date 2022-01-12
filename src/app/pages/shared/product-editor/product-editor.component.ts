import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrls: ['./product-editor.component.scss']
}) export class ProductEditorComponent implements OnInit {

  productSlabEditor = false;
  productImageEditor = false;
  productRelatedEditor = false;
  categories = false;
  productLines = false;
  errorMessage: any;
  product: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    editorType: string,
    product: any
  },
    private mdDialogRef: MatDialogRef<ProductEditorComponent>) {
    mdDialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.product = this.data.product;
    switch (this.data.editorType) {
      case 'productSlabs': {
        this.productSlabEditor = true;
        break;
      }
      case 'productImages': {
        this.productImageEditor = true;
        break;
      }
      case 'productRelated': {
        this.productRelatedEditor = true;
        break;
      }
      case 'categories': {
        this.categories = true;
        break;
      }
      case 'productLines': {
        this.productLines = true;
        break;
      }
      default: {
        break;
      }
    }
  }


  public CloseClick() {
    this.mdDialogRef.close();
  }
}
