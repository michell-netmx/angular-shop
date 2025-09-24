import { trigger, transition, style, animate } from '@angular/animations';

/**
 * Animación fadeIn para Angular 19
 * Usa la API estándar sin keyframes deprecated
 */
export const fadeInOutAnimation = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms ease-in-out', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    style({ opacity: 1 }),
    animate('300ms ease-in-out', style({ opacity: 0 }))
  ])
]);

/**
 * Variante más simple solo para entrada
 */
export const fadeInAnimation = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms ease-in-out', style({ opacity: 1 }))
  ])
]);

/**
 * Array de animaciones para usar en componentes
 */
export const fadeAnimations = [fadeInOutAnimation, fadeInAnimation];
