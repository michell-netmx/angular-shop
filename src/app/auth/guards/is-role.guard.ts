import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@auth/services/auth.service";
import { firstValueFrom } from "rxjs";
import { CanMatchFn } from "@angular/router";

export const isRoleGuard = (role: string): CanMatchFn => {
  return async () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const isAuthenticated = await firstValueFrom(authService.checkStatus());

    if (!isAuthenticated) {
      router.navigate(['/']);
      return false;
    }

    const user = authService.user();

    if (!user?.roles) {
      router.navigate(['/']);
      return false;
    }

    if (user.roles.find(userRole => userRole === role)) {
      return true;
    }

    router.navigate(['/']);
    return false;
  };
};
