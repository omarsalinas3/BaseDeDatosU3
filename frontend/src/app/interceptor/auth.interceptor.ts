import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  if (req.url.includes('/login') || req.url.includes('/registro')) {
    return next(req);
  }

  const token = authService.obtenerToken();
  const authReq = token ? req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  }) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout(false);
        toastr.error('Sesión expirada', 'Error');
        router.navigate(['/login'], { 
          queryParams: { returnUrl: router.url } 
        });
      } 
      else if (error.status === 403) {
        toastr.warning('No tienes permisos para esta acción', 'Acceso denegado');
        router.navigate(['/acceso-denegado']);
      }
      else {
        toastr.error(error.error?.message || 'Error en la solicitud', 'Error');
      }

      return throwError(() => error);
    })
  );
};