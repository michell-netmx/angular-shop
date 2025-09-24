import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  on = new BehaviorSubject<boolean>(false);
  type = new BehaviorSubject<'success' | 'error'>('success');

  show(type: 'success' | 'error' = 'success', time: number = 3000){
    this.type.next(type);
    this.on.next(true);

    setTimeout(() => {
      this.hide();
    }, time);
  }

  hide() {
    this.on.next(false);
  }
}
