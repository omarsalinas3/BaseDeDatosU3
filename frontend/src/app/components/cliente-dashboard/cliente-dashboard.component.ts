import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';
import { ModalComponent } from '../modal/modal.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cliente-dashboard',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule],
  templateUrl: './cliente-dashboard.component.html',
  styleUrls: ['./cliente-dashboard.component.css']
})
export class ClienteDashboardComponent implements OnInit {
  productos: Producto[] = [];
  productoSeleccionado: Producto | null = null;
  mostrarModal: boolean = false;
  loading: boolean = true;
  error: string | null = null;
  usuarioActual: any;
  filtroBusqueda: string = '';
  marcasUnicas: string[] = [];
  filtroMarca: string = '';
  ordenSeleccionado: string = '';

  constructor(
    private productoService: ProductoService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioActual = this.authService.currentUserValue;
    if (!this.usuarioActual) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return;
    }
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loading = true;
    this.error = null;
    
    this.productoService.getProductosParaClientes().subscribe({
      next: (response) => {
        this.productos = (response || []).filter(producto => producto.activo !== false);
        this.marcasUnicas = [...new Set(this.productos.map(p => p.marca))];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = `Error al cargar los productos: ${err.message || 'Error desconocido'}`;
        this.loading = false;
      }
    });
  }

  seleccionarProducto(producto: Producto): void {
    this.productoSeleccionado = {...producto};
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.productoSeleccionado = null;
  }

  getImagenPrincipal(producto: Producto): string {
    if (producto.imagenes && producto.imagenes.length > 0) {
      const principal = producto.imagenes.find(img => img.principal);
      return principal ? principal.url : producto.imagenes[0].url;
    }
    return 'https://via.placeholder.com/300x300.png?text=Sin+imagen';
  }

  getNombreProveedor(prov: string | { _id: string; nombre: string }): string {
    return typeof prov === 'object' ? prov.nombre : prov;
  }

  get productosFiltrados(): Producto[] {
    let productos = this.productos;
    
    // Aplicar filtro de búsqueda
    if (this.filtroBusqueda) {
      productos = productos.filter(producto => 
        producto.nombre.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        producto.marca.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        producto.codigoBarras.toLowerCase().includes(this.filtroBusqueda.toLowerCase())
      );
    }
    
    // Aplicar filtro de marca
    if (this.filtroMarca) {
      productos = productos.filter(producto => producto.marca === this.filtroMarca);
    }
    
    // Aplicar ordenamiento
    switch(this.ordenSeleccionado) {
      case 'precioAsc':
        productos = [...productos].sort((a, b) => a.precioPieza - b.precioPieza);
        break;
      case 'precioDesc':
        productos = [...productos].sort((a, b) => b.precioPieza - a.precioPieza);
        break;
    }
    
    return productos;
  }
}