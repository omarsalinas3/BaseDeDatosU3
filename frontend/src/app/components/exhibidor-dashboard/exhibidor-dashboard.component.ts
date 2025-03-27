import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';
import { ModalComponent } from '../modal/modal.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-exhibidor-dashboard',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule],
  templateUrl: './exhibidor-dashboard.component.html',
  styleUrls: ['./exhibidor-dashboard.component.css']
})
export class ExhibidorDashboardComponent implements OnInit {
  productos: Producto[] = [];
  productoSeleccionado: Producto | null = null;
  mostrarModal: boolean = false;
  loading: boolean = true;
  error: string | null = null;
  usuarioActual: any;
  filtroBusqueda: string = '';
  cantidadAAgregar: number = 0;
  mensajeStock: string = '';
  mensajeExito: boolean = false;

  constructor(
    private productoService: ProductoService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuarioActual = this.authService.currentUserValue;
    if (!this.usuarioActual || this.usuarioActual.rol !== 'AlmacenistaExhibidor') {
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
    this.cantidadAAgregar = 0;
    this.mensajeStock = '';
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.productoSeleccionado = null;
    this.cantidadAAgregar = 0;
    this.mensajeStock = '';
  }

  agregarStock(): void {
    if (!this.productoSeleccionado || !this.productoSeleccionado._id || this.cantidadAAgregar <= 0) {
      this.mensajeExito = false;
      this.mensajeStock = 'Ingrese una cantidad válida';
      setTimeout(() => this.mensajeStock = '', 3000);
      return;
    }
  
    const updateData = {
      stockExhibe: (this.productoSeleccionado.stockExhibe || 0) + this.cantidadAAgregar
    };
  
    this.productoService.updateProducto(this.productoSeleccionado._id, updateData).subscribe({
      next: (productoActualizado) => {
        const index = this.productos.findIndex(p => p._id === productoActualizado._id);
        if (index !== -1) {
          this.productos[index] = productoActualizado;
        }
        this.mensajeExito = true;
        this.mensajeStock = 'Stock actualizado correctamente';
        setTimeout(() => {
          this.mensajeStock = '';
          this.cerrarModal();
        }, 2000);
      },
      error: (err) => {
        console.error('Error al actualizar stock:', err);
        this.mensajeExito = false;
        this.mensajeStock = 'Error al actualizar el stock: ' + (err.error?.message || err.message || 'Error desconocido');
        setTimeout(() => this.mensajeStock = '', 4000);
      }
    });
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
    if (!this.filtroBusqueda) {
      return this.productos;
    }
    return this.productos.filter(producto => 
      producto.nombre.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
      producto.marca.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
      producto.codigoBarras.toLowerCase().includes(this.filtroBusqueda.toLowerCase())
    );
  }
}