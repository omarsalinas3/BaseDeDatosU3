import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';

interface Usuario {
  id: string;
  nombreUsuario: string;
  email: string;
  rol: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    usuario: Usuario;
  };
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = "http://localhost:3000/api/auth";
  private currentUserSubject: BehaviorSubject<Usuario | null>;
  public currentUser: Observable<Usuario | null>;
  private jwtHelper = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.currentUserSubject = new BehaviorSubject<Usuario | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  registro(userData: any): Observable<Usuario> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/registro`, userData).pipe(
      map(response => {
        if (response.success && response.data.usuario) {
          this.toastr.success('Registro exitoso');
          return response.data.usuario;
        }
        throw new Error(response.message || "Error al registrar usuario");
      }),
      catchError(error => {
        this.toastr.error(error.error?.message || 'Error en el registro');
        return throwError(() => error);
      })
    );
  }

  login(email: string, password: string): Observable<Usuario> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      map(response => {
        if (response.success && response.data) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('currentUser', JSON.stringify(response.data.usuario));
          this.currentUserSubject.next(response.data.usuario);
          this.redireccionarPorRol(response.data.usuario);
          return response.data.usuario;
        }
        throw new Error(response.message || "Error en la autenticación");
      }),
      catchError(error => {
        this.toastr.error(error.error?.message || 'Credenciales inválidas');
        return throwError(() => error);
      })
    );
  }

  public redireccionarPorRol(usuario: Usuario): void {
    const returnUrl = this.router.parseUrl(this.router.url).queryParams['returnUrl'];
    
    switch(usuario.rol) {
      case 'Cliente':
        this.router.navigateByUrl(returnUrl || '/cliente');
        break;
      case 'AlmacenistaInventario':
        this.router.navigateByUrl(returnUrl || '/inventario');
        break;
      case 'AlmacenistaExhibidor':
        this.router.navigateByUrl(returnUrl || '/exhibidor');
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  logout(showMessage: boolean = true): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    if (showMessage) {
      this.toastr.info('Sesión cerrada');
    }
    this.router.navigate(['/login']);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.obtenerToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  get currentUserValue(): Usuario | null {
    return this.currentUserSubject.value;
  }

  getUsuarioRol(): string | null {
    return this.currentUserValue?.rol || null;
  }

  hasRole(roles: string[]): boolean {
    const userRole = this.currentUserValue?.rol;
    return !!userRole && roles.includes(userRole);
  }
}