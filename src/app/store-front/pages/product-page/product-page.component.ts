import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductsService } from '@products/services/products.service';
import { of } from 'rxjs';
import { ProductImagePipe } from "../../../products/pipes/product-image.pipe";
import { ProductCarouselComponent } from "@products/components/product-carousel/product-carousel.component";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {

  productService = inject(ProductsService);
  productSlug = inject(ActivatedRoute).snapshot.params['idSlug'];

  productResource = rxResource({
    request: () =>({ idSlug: this.productSlug}),
    loader: ({ request }) => {

      if(!request.idSlug){
        return of(null);
      }

      console.log(request);
      return this.productService.getProductByIdSlug(request.idSlug);
    }
  });
}
