import {  Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface Usuario {
  id: string;
  nombreUsuario: string;
  email: string;
  rol: string;
}

export interface AuthResponse {
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
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router){
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<Usuario | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();

    //Verificamos el token al inciar la aplicacion
    if(this.obtenerToken()){
      this.validarToken();
    }
  }

  public get currentUserValor(): Usuario | null {
    return this.currentUserSubject.value;
  }

  registro(userData: any): Observable<Usuario>{
    return this.http.post<AuthResponse>(`${this.apiUrl}/registro`, userData).pipe(
      map(response => {
        if(response.success && response.data.usuario){
          return response.data.usuario;
        }else{
          throw new Error(response.message || "Error al registrar usuario");
        }
      }),
      catchError(error => {
        const errorMsg = error.error?.message || error.message || "Error en el servidor";
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  login(email: string, password: string): Observable<Usuario>{
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      map(response => {
        if(response.success && response.data){
          //Se guarda el token en almacenamiento local
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('currentUser', JSON.stringify(response.data.usuario));

          //Se actualiza el BehaiviorSubject
          this.currentUserSubject.next(response.data.usuario);

          //Se configura el temporizador para la expiracion del token
          this.autoLogout(1 * 60 * 60 * 1000); // 1 hora en milisegundos

          return response.data.usuario;
        }else{
          throw new Error(response.message || "Error en la autenticacion");
        }
      }),
      catchError(error => {
        return throwError(() => new Error(error.error?.message || "Credenciales invalidas"));
      })
    );
  }

  logout(): void{
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);

    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  obtenerToken(): string | null{
    return localStorage.getItem('token');
  }

  validarToken(): void{
    this.http.get<any>(`${this.apiUrl}/yo`).pipe(
      catchError(()=>{
        this.logout();
        return throwError(() => new Error("Token expirado"));
      })
    ).subscribe();
  }

  isLoggedIn(): boolean{
    return !!this.currentUserValor;
  }

  hasRole(rolesRequeridos: string[]): boolean{
    const userRole = this.currentUserValor?.rol;
    return !!userRole && rolesRequeridos.includes(userRole);
  }

  obtenerRolDelUsuario(): string | null{
    return this.currentUserValor?.rol || null;
  }

  private autoLogout(expirationDuration: number): void{
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
}