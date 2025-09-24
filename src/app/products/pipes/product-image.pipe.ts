import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Pipe({
  name: 'productImage'
})
export class ProductImagePipe implements PipeTransform {
  transform(value: string | string[] | null): any {

    if(typeof value === 'string' && value.startsWith('blob:')){
      return value;
    }

    if(typeof value === 'string'){
      return `${baseUrl}/files/product/${value}`;
    }

    if(Array.isArray(value) && value.length>0 && typeof value[0] === 'string'){
      return `${baseUrl}/files/product/${value[0]}`;
    }

    return './assets/images/no-image.jpg';
  }
}
