import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/registro/registro.component';
import { AccesoDenegadoComponent } from './components/acceso-denegado/acceso-denegado.component';
import { ExhibidorDashboardComponent } from './components/exhibidor-dashboard/exhibidor-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { 
    path: 'inventario', 
    loadComponent: () => import('./components/producto-crud/producto-crud.component').then(m => m.ProductoCrudComponent),
    canActivate: [authGuard],
    data: { roles: ['AlmacenistaInventario'] } 
  },
  { 
    path: 'productos/:id/historial-precios', 
    loadComponent: () => import('./components/historial-precios/historial-precios.component').then(m => m.HistorialPreciosComponent),
    canActivate: [authGuard],
    data: { roles: ['AlmacenistaInventario'] } 
  },
  { 
    path: 'exhibidor', 
    component: ExhibidorDashboardComponent,
    canActivate: [authGuard],
    data: { roles: ['AlmacenistaExhibidor'] } 
  },
  { 
    path: 'cliente', 
    loadComponent: () => import('./components/cliente-dashboard/cliente-dashboard.component').then(m => m.ClienteDashboardComponent),
    canActivate: [authGuard],
    data: { roles: ['Cliente'] } 
  },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'acceso-denegado', component: AccesoDenegadoComponent },
  { path: '**', redirectTo: 'login' }
];