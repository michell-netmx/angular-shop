import { Component, input, inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { FormUtils } from '@utils/form-utils';
import { Product } from '@products/interfaces/product.interface';
import { ProductCarouselComponent } from "@products/components/product-carousel/product-carousel.component";
import { FormErrorLabelComponent } from "@shared/components/form-error-label/form-error-label.component";
import { ProductsService } from '@products/services/products.service';
import { AlertService } from '@admin-dashboard/components/alert/alert.service';

@Component({
  selector: 'product-details',
  imports: [
    ProductCarouselComponent,
    ReactiveFormsModule,
    FormErrorLabelComponent
],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {

  router = inject(Router);
  fb = inject(FormBuilder);
  productService = inject(ProductsService);
  alertService = inject(AlertService);

  product = input.required<Product>();
  wasSaved = signal(false);
  tempImages = signal<string[]>([]);
  imageFileList: FileList | undefined = undefined;
  imagesToCarousel = computed(() => {
    const currentProductImages = [ ... this.product().images, ... this.tempImages() ];
    return currentProductImages;
  });

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [ Validators.required, Validators.pattern(FormUtils.slugPattern) ]],
    price: [0, [Validators.required, Validators.min(1)]],
    stock: [0, [Validators.required, Validators.min(1)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]]
  });

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue( formLike: Partial<Product> ) {
    this.productForm.reset(this.product() as any); // Prefer over patchValue: reset() marks the form as pristine
    this.productForm.patchValue({ tags: formLike.tags?.join(',') });
    //this.productForm.patchValue(formLike as any);
  }

  onSizeClicked( size: string ) {
    const currentSizes = this.productForm.value.sizes ?? [];

    if ( currentSizes.includes(size) ) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes });
  }

  async onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();

    if( !isValid ){
      return;
    }

    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ... (formValue as any),
      tags: formValue.tags?.toLowerCase().split(',').map( tag => tag.trim() ) ?? []
    };

    try {
      if(this.product().id === 'new'){
        const product = await firstValueFrom(this.productService.createProduct(productLike, this.imageFileList));
        this.alertService.show();
        this.router.navigate(['/admin/product/', product.id]);
      }else{
        await firstValueFrom(this.productService.updateProduct(this.product().id, productLike, this.imageFileList));
        this.alertService.show();
      }
    } catch (error) {
      this.alertService.show('error', 5000);
    }
  }

  onFilesChanged(event: Event) {

    //JavaScript FileList
    const fileList = ( event.target as HTMLInputElement ).files;
    console.log(fileList);
    this.imageFileList = fileList ?? undefined;

    const imageUrls = Array.from( fileList ?? [] ).map( file => URL.createObjectURL(file) );
    console.log(imageUrls);

    this.tempImages.set(imageUrls);
  }
}
