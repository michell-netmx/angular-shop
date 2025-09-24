import { Component, computed, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductTableComponent } from "@products/components/product-table/product-table.component";
import { ProductsService } from '@products/services/products.service';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-products-admin-page',
  imports: [
    RouterLink,
    ProductTableComponent,
    PaginationComponent
  ],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {

  productsService = inject(ProductsService);
  activatedRoute = inject(ActivatedRoute);
  paginationService = inject(PaginationService);

  currentPage = this.paginationService.currentPage;
  limit = this.paginationService.itemsForPage;

  productsResource = rxResource({
    request: () => ({ page: this.currentPage(), limit: this.limit() }),
    loader: ({request}) => {
      return this.productsService.getProducts({limit: request.limit, offset: request.limit * ( request.page -1) });
    }
  });

  pages = computed(() => this.productsResource.hasValue() ? this.productsResource.value()?.pages : 0)
}
