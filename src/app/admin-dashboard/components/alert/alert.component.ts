import { Component, inject, signal } from '@angular/core';
import { AlertService } from './alert.service';
import { AsyncPipe } from '@angular/common';
import { fadeInOutAnimation } from '../../../shared/animations/fade-in.animation';

@Component({
  selector: 'alert',
  imports: [
    AsyncPipe
  ],
  templateUrl: './alert.component.html',
  animations: [fadeInOutAnimation]
})
export class AlertComponent {
  show = inject(AlertService).on.asObservable();
  type = inject(AlertService).type.asObservable();
}
