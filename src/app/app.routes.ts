import { Routes } from '@angular/router';
import { isRoleGuard } from '@auth/guards/is-role.guard';
import { NotAutheticatedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [
      () => true,
      NotAutheticatedGuard
    ]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin-dashboard/admin-dashboard.routes'),
    canMatch: [
      isRoleGuard('admin')
    ]
  },
  {
    path: '',
    loadChildren: () => import('./store-front/store-front.routes')
  }
];
