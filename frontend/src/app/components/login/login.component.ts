import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl: string = '/';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // Redireccionar si ya está logueado
    if (this.authService.isLoggedIn()) {
      this.redireccionarBaseAlRole();
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Obtener url de retorno de los parámetros de la ruta o usar '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.getDefaultRouteForCurrentUser();
  }

  // Acceso fácil a los campos del formulario
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // Detener si el formulario es inválido
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: () => {
          this.redireccionarBaseAlRole();
        },
        error: error => {
          this.error = error.message || 'Error de autenticación';
          this.loading = false;
        }
      });
  }

  private redireccionarBaseAlRole(): void {
    const rol = this.authService.obtenerRolDelUsuario();

    switch (rol) {
      case 'Cliente':
        this.router.navigate(['/cliente']);
        break;
      case 'AlmacenistaInventario':
        this.router.navigate(['/inventario']);
        break;
      case 'AlmacenistaExhibidor':
        this.router.navigate(['/exhibidor']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }

  private getDefaultRouteForCurrentUser(): string {
    const user = this.authService.currentUserValor;
    if (!user) return '/';

    switch (user.rol) {
      case 'Cliente':
        return '/cliente/dashboard';
      case 'AlmacenistaInventario':
        return '/inventario/dashboard';
      case 'AlmacenistaExhibidor':
        return '/exhibidor/dashboard';
      default:
        return '/';
    }
  }
}