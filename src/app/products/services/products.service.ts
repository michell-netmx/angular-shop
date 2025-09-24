import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from 'backend-nest/nest-teslo-shop-complete-backend-paginated/dist/auth/entities/user.entity';
import { FileResponse } from '@products/interfaces/file-response.interface';

const baseUrl = environment.baseUrl;

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {}  as User
};

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
};

@Injectable({providedIn: 'root'})
export class ProductsService {

  private http = inject(HttpClient);
  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {

    const { limit = 100, offset = 0, gender = '' } = options;
    const key = `${limit}-${offset}-${gender}`;

    if(this.productsCache.has(key)){
      return of({
        count: this.productsCache.get(key)!.count,
        pages: this.productsCache.get(key)!.pages,
        products: this.productsCache.get(key)!.products
      });
    }

    return this.http.get<ProductsResponse>(`${baseUrl}/products`,
      {
        params: {
          limit,
          offset,
          gender
        }
      }
    ).pipe(
      tap( resp => console.log( 'New request: ', {resp})),
      tap( resp => this.productsCache.set(key, resp))
    );
  }

  getProductByIdSlug(slug: string) : Observable<Product> {

    if(this.productCache.has(slug)){
      return of(this.productCache.get(slug)!);
    }

    return this.http.get<Product>(`${baseUrl}/products/${slug}`).pipe(
      tap( resp => this.productCache.set(slug, resp))
    );
  }

  getProductById(id: string) : Observable<Product> {

    console.log( 'productCache:', this.productCache.entries() );

    if(id==='new'){
      return of(emptyProduct);
    }

    if(this.productCache.has(id)){
      return of(this.productCache.get(id)!);
    }

    return this.http.get<Product>(`${baseUrl}/products/${id}`).pipe(
      tap( resp => this.productCache.set(id, resp))
    );
  }

  // Not used
  getProductImage(image: string): Observable<string | null> {
    return this.http.get(`${baseUrl}/files/product/${image}`, {
      responseType: 'blob'
    }).pipe(
      map( blob => blob ? URL.createObjectURL(blob) : null )
    );
  }

  createProduct(productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {
    return this.http.post<Product>(`${baseUrl}/products/`, productLike).pipe(
      tap( product => {
        const id = product.id;
        const slug = product.slug;

        this.productCache.set(id, product);
        this.productCache.set(slug, product);

        this.productsCache.clear()
      })
    );
  }

  updateProduct(id: string, productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {

    const currentImages = productLike.images ?? [];

    return this.uploadImages(imageFileList).pipe(
      map( imageNames => ({
        ... productLike,
        images: [ ... currentImages, ... imageNames ]
      })),
      switchMap( updatedProduct =>
        this.http.patch<Product>(`${baseUrl}/products/${id}`, updatedProduct)
      ),
      tap( product => this.updateProductCache(product) )
    );

    // return this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike).pipe(
    //   tap( product => this.updateProductCache(product) )
    // );
  }

  updateProductCache(product: Product) {
    const id = product.id;
    const slug = product.slug;

    this.productCache.set(id, product);
    this.productCache.set(slug, product);

    this.productsCache.forEach(productsResponse => {
      productsResponse.products = productsResponse.products.map((currentProduct) => currentProduct.id === product.id ? product : currentProduct );
    });
  }

  uploadImages(imagesFiles?: FileList): Observable<string[]> {
    if ( !imagesFiles ) {
      return of([]);
    }

    const uploadObservables = Array.from(imagesFiles).map( imageFile => this.uploadImage(imageFile) );

    return forkJoin(uploadObservables).pipe(
      tap( imageNames => console.log({imageNames}) )
    );
  }

  uploadImage(imageFile: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', imageFile);
    return this.http.post<FileResponse>(`${baseUrl}/files/product`, formData).pipe(
      map( response => response.fileName )
    );
  }
}
