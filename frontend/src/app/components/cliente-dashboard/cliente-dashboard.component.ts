import { Component } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-cliente-dashboard',
  imports: [],
  templateUrl: './cliente-dashboard.component.html',
  styleUrl: './cliente-dashboard.component.css'
})
export class ClienteDashboardComponent {
  productosDisponibles: Producto[] = [];

  constructor(private productoService: ProductoService){
    this.cargarProductoCliente();
  }

  cargarProductoCliente() {
    this.productoService.getProductosParaClientes().subscribe({
      next: (data) => this.productosDisponibles = data,
      error: (err) => console.error('Error al obtener productos para clientes:', err)
    });
  }

}
