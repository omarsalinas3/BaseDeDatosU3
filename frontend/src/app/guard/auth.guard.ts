import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  if (!authService.isLoggedIn()) {
    if (!state.url.includes('acceso-denegado')) {
      toastr.warning('Debes iniciar sesión para acceder');
    }
    return router.createUrlTree(['/login'], { 
      queryParams: { returnUrl: state.url } 
    });
  }

  const rolesRequeridos = route.data['roles'] as string[];
  if (rolesRequeridos && !authService.hasRole(rolesRequeridos)) {
    toastr.error('No tienes permisos para acceder');
    return router.createUrlTree(['/acceso-denegado']);
  }

  return true;
};