import { Routes } from '@angular/router';
import { ProductoCrudComponent } from './components/producto-crud/producto-crud.component';
import { HistorialPreciosComponent } from './components/historial-precios/historial-precios.component';

export const routes: Routes = [
  { path: '', redirectTo: 'productos', pathMatch: 'full' },
  { path: 'productos', component: ProductoCrudComponent },
  { path: 'productos/:id/historial-precios', component: HistorialPreciosComponent },
  { path: '**', redirectTo: 'productos' }
];


