import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { tap } from 'rxjs';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {

  private productsService = inject(ProductsService);
  private paginationService = inject(PaginationService);

  currentPage = this.paginationService.currentPage;
  limit = this.paginationService.itemsForPage;
  /* activatedRoute = inject(ActivatedRoute);

  currentPage = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map( params => params.get('page') ? +params.get('page')! : 1 ),
      map( page => isNaN(page) ? 1 : page)
    ),
    {
      initialValue: 1
    }
  ); */

  productsResource = rxResource({
    request:() => ({ page: this.currentPage(), limit: this.limit()}),
    loader: ({request}) => {
      return this.productsService.getProducts({
        limit: request.limit,
        offset: (request.page - 1) * request.limit
      }).pipe(
        tap( resp => {
          /* this.pageCount = resp.pages;
          this.totalProducts = resp.count; */
        })
      );
    }
  });

  pageCount = computed(() => {
    return this.productsResource.value()?.pages;
  });

  totalProducts = computed(() => {
    return this.productsResource.value()?.count;
  });
}
