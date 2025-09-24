import { AfterViewInit, Component, effect, ElementRef, input, OnChanges, OnDestroy, SimpleChanges, viewChild } from '@angular/core';

// core version + navigation, pagination modules:
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

@Component({
  selector: 'product-carousel',
  imports: [
    ProductImagePipe
  ],
  templateUrl: './product-carousel.component.html',
  styles: `
    .swiper {
      width: 90%;
    }
  `
})
export class ProductCarouselComponent implements AfterViewInit, OnDestroy, OnChanges {

  images = input.required<string[]>();
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');

  swiper: Swiper | null = null;

  swipperUpdate() {
    console.log('1');
    this.swiper?.update();
  }

  ngAfterViewInit(): void {
    this.swiperInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['images'].firstChange){
      return;
    }

    this.swiper?.destroy();
    setTimeout( () => {
      this.swiperInit();
    }, 1000 );
  }

  ngOnDestroy(): void {
    this.swiper?.destroy();
  }

  swiperInit() {
    const element = this.swiperDiv().nativeElement;
    if( !element ) return ;

    console.log({element});

    this.swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,

      modules: [
        Navigation,
        Pagination
      ],

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }
}
