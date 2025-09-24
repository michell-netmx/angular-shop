import { AsyncPipe, SlicePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/product.interface';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';
import { ProductsService } from '@products/services/products.service';
import { of, tap, map } from 'rxjs';

@Component({
  selector: 'product-card',
  imports: [
    RouterLink,
    SlicePipe,
    ProductImagePipe
  ],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {

  productsService = inject(ProductsService);
  product = input.required<Product>();

  // Not used
  /* imageUrl = rxResource({
    request: () => ({ query: this.product().images[0]}),
    loader: ({request}) => {
      if(!request.query){
        return of(null);
      }
      return this.productsService.getProductImage(request.query);
    }
  }); */

}
