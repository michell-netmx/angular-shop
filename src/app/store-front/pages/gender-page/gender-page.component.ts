import { Component, computed, inject } from '@angular/core';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, of } from 'rxjs';
import { I18nSelectPipe } from '@angular/common';
import { ProductsService } from '@products/services/products.service';
import { ProductCardComponent } from "@products/components/product-card/product-card.component";
import { Gender } from '@products/interfaces/product.interface';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [
    ProductCardComponent,
    I18nSelectPipe,
    PaginationComponent
],
  templateUrl: './gender-page.component.html'
})
export class GenderPageComponent {

  genderMap = {
    men: 'Hombre',
    women: 'Mujer',
    kid: 'Niño'
  };
  limit = 6;

  activatedRoute = inject(ActivatedRoute);
  productsServices = inject(ProductsService);
  paginationService = inject(PaginationService);

  currentPage = this.paginationService.currentPage;

  gender = toSignal<string>(
    this.activatedRoute.params.pipe(
      map( ({gender}) => gender )
    )
  );

  productsResource = rxResource({
    request: () => ({gender: this.gender(), page: this.currentPage()}),
    loader: ({request}) => {
      if( !typeof Gender ){
        return of(null);
      }
      return this.productsServices.getProducts({
        gender: request.gender,
        limit: this.limit,
        offset: (request.page -1) * request.page
      });
    }
  });

  totalProducts = computed(() => this.productsResource.value()?.count);
  pagesCount = computed(() => this.productsResource.value()?.pages ?? 0 );
}
