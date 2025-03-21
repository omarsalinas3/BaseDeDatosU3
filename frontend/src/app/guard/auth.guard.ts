// auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  

  if(!authService.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  
  // Verificamos los roles si están definidos en la ruta
  /*const rolesRequeridos = route.data['roles'] as string[];
  if(rolesRequeridos && rolesRequeridos.length > 0) {
    const userRole = authService.currentUserValor?.rol;
    
    if(!userRole) {
      router.navigate(['/acceso-denegado']);
      return false;
    }

    if(!rolesRequeridos.includes(userRole)){
      router.navigate(['/acceso-denegado']);
      return false;
    }
  }*/
  
  return true;
};