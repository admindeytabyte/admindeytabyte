
import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ToastrService } from 'ngx-toastr';
import { ProductImage } from '../interfaces/productImage';


@Component({
  selector: 'app-product-images-editor',
  templateUrl: './product-images-editor.component.html',
  styleUrls: ['./product-images-editor.component.scss']
})

export class ProductImagesEditorComponent implements OnInit {
  @Input() product: any;
  productImages: any[];
  errorMessage: any;
  selectedImage: any;

  constructor(private dataService: DataService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.RefreshProductImages();
  }

  RefreshProductImages() {
    this.dataService.GetProductImages(this.product.id).subscribe(data => {
      this.productImages = data;
    });
  }

  ImageFocusChanged(e) {
    this.selectedImage = e.row.data.pictureUrl;
  }

  // Image management
  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      const selectedFile = new ProductImage(event.target.result, file);
      this.dataService
        .uploadImage(selectedFile.file, this.product.id)
        .subscribe(
          (res) => {
            this.productImages.push(res);
            this.toastr.success('Image Updated Successfully!', 'Success', {
              timeOut: 3000,
            });
          },
          (err) => { }
        );
    });
    reader.readAsDataURL(file);
  }

  ProductImagesAdded(e: { data: any }) {
    e.data.lineId = 0;
    this.dataService.AddProductImages(e.data).subscribe(
      (response) => {
        this.toastr.success('Added Successfully!', 'Success', {
          timeOut: 2000,
        });
        // Update Key of added entity from response object
        e.data.categoryId = response['lineId'];
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error.error, 'Add Failed');
      }
    );
  }

  ProductImagesUpdated(e: any) {
    this.dataService.UpdateProductImages(e.data).subscribe(
      (response) => {
        this.toastr.success('Updated Successfully!', 'Success', {
          timeOut: 2000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error(error, 'Update Failed');
      }
    );
  }

  ProductImagesDeleted(e: any) {
    this.dataService.DeleteProductImages(e.data.id).subscribe(
      (response) => {
        this.toastr.success('Deleted Successfully!', 'Success', {
          timeOut: 2000,
        });
      },
      (error) => {
        this.errorMessage = error.error;
        this.toastr.error('Delete Failed ' + this.errorMessage);
        this.RefreshProductImages();
      }
    );
  }


}
