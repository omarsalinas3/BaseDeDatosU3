import { Routes } from '@angular/router';
import { ProductoCrudComponent } from './components/producto-crud/producto-crud.component';
import { HistorialPreciosComponent } from './components/historial-precios/historial-precios.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/registro/registro.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'inventario', loadComponent: () => import('./components/producto-crud/producto-crud.component').then(m => m.ProductoCrudComponent), canActivate: [authGuard], data: {roles: ['AlmacenistaInventario']} },
  { path: 'exhibidor', loadComponent: () => import('./components/exhibidor-dashboard/exhibidor-dashboard.component').then(m => m.ExhibidorDashboardComponent), canActivate: [authGuard], data: {roles: ['AlmacenistaExhibidor']} },
  { path: 'cliente', loadComponent: () => import('./components/cliente-dashboard/cliente-dashboard.component').then(m => m.ClienteDashboardComponent), canActivate: [authGuard], data: {roles: ['Cliente']} },
 //{ path: 'acceso-denegado', loadComponent:() => import('./components/acceso-denegado/acceso-denegado.component').then(m => m.AccesoDenegadoComponent)},
  { path: 'productos', component: ProductoCrudComponent },
  { path: 'productos/:id/historial-precios', component: HistorialPreciosComponent },
  { path: 'login', component: LoginComponent },
  {  path: 'registro', component: RegisterComponent },
  { path: '**', redirectTo: 'productos' }
];


