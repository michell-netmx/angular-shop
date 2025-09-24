import { Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'shared-pagination',
  imports: [
    RouterLink
  ],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {

  pages = input<number>(0);
  currentPage = input<number>(1);
  itemsForPage = input<number>(10);
  align = input<string>('center');

  activePage = linkedSignal(this.currentPage);
  items = linkedSignal(this.itemsForPage);

  getPagesList = computed(() => {
    return Array.from({length: this.pages()}, (_, i) => i+1 );
  });

  handleDropdownClick = (event: Event) => {
    // Quitar el foco del anchor específico que fue clickeado
    const target = event.target as HTMLElement;
    if (target && typeof target.blur === 'function') {
      target.blur();
    }
  }
}
