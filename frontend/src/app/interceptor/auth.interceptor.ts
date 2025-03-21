// auth.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Se obtiene el token
  const token = authService.obtenerToken();
  
  // Si existe un token se agrega al header
  if(token) {
    req = req.clone({
      setHeaders: {
        Autorizacion: `Bearer ${token}`
      }
    });
  }
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if(error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      } else if(error.status === 403) {
        router.navigate(['/acceso-denegado']);
      }
      
      return throwError(() => error);
    })
  );
};