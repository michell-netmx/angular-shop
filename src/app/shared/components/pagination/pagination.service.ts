import { ActivatedRoute } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PaginationService {

  private activatedRoute = inject(ActivatedRoute);

  currentPage = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map( params => params.get('page') ? +params.get('page')! : 1 ),
      map( page => isNaN(page) ? 1 : page)
    ),
    {
      initialValue: 1
    }
  );

  itemsForPage =  toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map( params => params.get('items') ? +params.get('items')! : 10 ),
      map( items => isNaN(items) ? 10 : items)
    ),
    {
      initialValue: 10
    }
  );
}
