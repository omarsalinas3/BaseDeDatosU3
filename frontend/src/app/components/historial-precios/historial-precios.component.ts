import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';

// Definimos la interfaz para evitar conflictos
interface HistorialPrecio {
  fechaInicio: Date;
  fechaFin: Date;
  precioAnterior: number;
  precioPieza: number;
  precioCaja: number;
  variacion?: number;
}

@Component({
  selector: 'app-historial-precios',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './historial-precios.component.html',
  styleUrls: ['./historial-precios.component.css']
})
export class HistorialPreciosComponent implements OnInit {
  productoId: string | null = null;
  producto: Producto | null = null;
  historialCompleto: HistorialPrecio[] = [];
  historialFiltrado: HistorialPrecio[] = [];
  loading: boolean = true;
  error: boolean = false;
  errorMessage: string = '';
  
  filtroForm: FormGroup;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService,
    private fb: FormBuilder
  ) {
    this.filtroForm = this.fb.group({
      fechaInicio: [''],
      fechaFin: ['']
    });
  }
  
  ngOnInit(): void {
    this.productoId = this.route.snapshot.paramMap.get('id');
    
    if (this.productoId) {
      this.cargarProducto();
    } else {
      this.error = true;
      this.errorMessage = 'ID de producto no válido';
      this.loading = false;
    }
    
    // Establecer fechas predeterminadas (último mes)
    const hoy = new Date();
    const unMesAtras = new Date();
    unMesAtras.setMonth(hoy.getMonth() - 1);
    
    this.filtroForm.patchValue({
      fechaInicio: this.formatDate(unMesAtras),
      fechaFin: this.formatDate(hoy)
    });
  }
  
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  cargarProducto(): void {
    if (!this.productoId) return;
    
    this.loading = true;
    this.error = false;
    
    this.productoService.getProductoById(this.productoId).subscribe({
      next: (data) => {
        this.producto = data;
        this.cargarHistorial();
      },
      error: (err) => {
        console.error('Error al cargar producto:', err);
        this.error = true;
        this.errorMessage = 'Error al cargar información del producto: ' + err.message;
        this.loading = false;
      }
    });
  }
  
  cargarHistorial(): void {
    if (!this.productoId) return;
    
    this.loading = true;
    this.error = false;
    
    this.productoService.getHistorialPrecios(this.productoId).subscribe({
      next: (data) => {
        // Asegúrate de que data sea del tipo correcto
        this.historialCompleto = data as HistorialPrecio[];
        this.procesarHistorial();
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar historial:', err);
        this.error = true;
        this.errorMessage = 'Error al cargar historial de precios: ' + err.message;
        this.loading = false;
      }
    });
  }

  procesarHistorial(): void {
    // Asegurarse de que el historial tenga la estructura adecuada
    if (this.producto && this.producto.historialPrecios) {
      this.historialCompleto = this.producto.historialPrecios.map(registro => {
        const historialItem: HistorialPrecio = {
          fechaInicio: new Date(registro.fechaInicio),
          fechaFin: new Date(registro.fechaFin),
          precioAnterior: registro.precioAnterior,
          precioPieza: this.producto?.precioPieza || 0,
          precioCaja: this.producto?.precioCaja || 0
        };
        return historialItem;
      });
    }
  }
  
  aplicarFiltros(): void {
    const filtros = this.filtroForm.value;
    
    if (!this.historialCompleto || this.historialCompleto.length === 0) {
      this.historialFiltrado = [];
      return;
    }
    
    let fechaInicio = filtros.fechaInicio ? new Date(filtros.fechaInicio) : null;
    let fechaFin = filtros.fechaFin ? new Date(filtros.fechaFin) : null;
    
    // Si tenemos fechaFin, ajustar al final del día
    if (fechaFin) {
      fechaFin.setHours(23, 59, 59, 999);
    }
    
    this.historialFiltrado = this.historialCompleto.filter(registro => {
      const registroInicio = new Date(registro.fechaInicio);
      const registroFin = new Date(registro.fechaFin);
      
      // Aplicar filtros de fecha
      if (fechaInicio && registroFin < fechaInicio) return false;
      if (fechaFin && registroInicio > fechaFin) return false;
      
      return true;
    });
    
    // Ordenar por fecha (más reciente primero)
    this.historialFiltrado.sort((a, b) => {
      return new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime();
    });
    
    // Calcular variación de precios
    if (this.historialFiltrado.length > 0) {
      for (let i = 0; i < this.historialFiltrado.length; i++) {
        const actual = this.historialFiltrado[i];
        const siguiente = i < this.historialFiltrado.length - 1 ? this.historialFiltrado[i + 1] : null;
        
        if (siguiente && siguiente.precioAnterior) {
          actual.variacion = (actual.precioAnterior - siguiente.precioAnterior) / siguiente.precioAnterior;
        } else {
          actual.variacion = 0;
        }
      }
    }
  }
  
  volver(): void {
    this.router.navigate(['/productos']);
  }
}