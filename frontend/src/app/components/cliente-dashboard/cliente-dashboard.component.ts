import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cliente-dashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './cliente-dashboard.component.html',
  styleUrl: './cliente-dashboard.component.css',
  standalone: true
})
export class ClienteDashboardComponent implements OnInit {
  productosDisponibles: Producto[] = [];
  productosFiltrados: Producto[] = [];
  marcasUnicas: string[] = [];

  // Filtros
  filtroNombre: string = '';
  filtroMarca: string = '';
  ordenSeleccionado: string = '';

  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    this.cargarProductoCliente();
  }

  cargarProductoCliente() {
    this.productoService.getProductosParaClientes().subscribe({
      next: (data) => {
        this.productosDisponibles = data;
        this.productosFiltrados = [...this.productosDisponibles];
        this.obtenerMarcasUnicas();
      },
      error: (err) => console.error('Error al obtener productos para clientes:', err)
    });
  }

  obtenerMarcasUnicas() {
    this.marcasUnicas = [...new Set(this.productosDisponibles.map(p => p.marca))];
  }

  filtrarProductos() {
    this.productosFiltrados = this.productosDisponibles.filter(producto => 
      (!this.filtroNombre || 
        producto.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())) &&
      (!this.filtroMarca || producto.marca === this.filtroMarca)
    );

    this.ordenarProductos();
  }

  ordenarProductos() {
    switch(this.ordenSeleccionado) {
      case 'precioAsc':
        this.productosFiltrados.sort((a, b) => a.precioPieza - b.precioPieza);
        break;
      case 'precioDesc':
        this.productosFiltrados.sort((a, b) => b.precioPieza - a.precioPieza);
        break;
      default:
        // Mantener el orden original
        break;
    }
  }
}