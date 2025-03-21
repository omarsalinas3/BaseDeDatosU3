import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Importar Router
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';

interface Proveedor {
  _id: string;
  nombre: string;
}

@Component({
  selector: 'app-producto-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <h2>Gestión de Productos</h2>
      
      <div *ngIf="loading" class="alert alert-info">
        Cargando datos... 
        <span *ngIf="loadingMessage">({{ loadingMessage }})</span>
      </div>
      
      <div *ngIf="error" class="alert alert-danger">
        {{ errorMessage }}
        <button class="btn btn-sm btn-outline-danger ms-2" (click)="cargarDatos()">Reintentar</button>
      </div>
      
      <!-- Formulario para registrar/editar producto -->
      <div class="card mb-4">
        <div class="card-header">
          {{ modoEdicion ? 'Editar Producto' : 'Registrar Nuevo Producto' }}
        </div>
        <div class="card-body">
          <form [formGroup]="productoForm" (ngSubmit)="guardarProducto()">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label>Código de Barras</label>
                <input type="text" class="form-control" formControlName="codigoBarras">
                <div *ngIf="productoForm.get('codigoBarras')?.invalid && productoForm.get('codigoBarras')?.touched" class="text-danger">
                  Código de barras es requerido
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label>Nombre</label>
                <input type="text" class="form-control" formControlName="nombre">
                <div *ngIf="productoForm.get('nombre')?.invalid && productoForm.get('nombre')?.touched" class="text-danger">
                  Nombre es requerido
                </div>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-4 mb-3">
                <label>Marca</label>
                <select class="form-control" formControlName="marca">
                  <option *ngFor="let marca of marcas" [value]="marca">{{ marca }}</option>
                </select>
              </div>
              <div class="col-md-4 mb-3">
                <label>Tamaño</label>
                <select class="form-control" formControlName="tamano">
                  <option value="Pequeño">Pequeño</option>
                  <option value="Mediano">Mediano</option>
                  <option value="Grande">Grande</option>
                </select>
              </div>
              <div class="col-md-4 mb-3">
                <label>Proveedores</label>
                <select class="form-control" formControlName="proveedores" multiple>
                  <option *ngFor="let proveedor of proveedores" [value]="proveedor._id">
                    {{ proveedor.nombre }}
                  </option>
                </select>
                <div *ngIf="proveedores.length === 0" class="text-warning mt-1">
                  {{ loadingProveedores ? 'Cargando proveedores...' : 'No hay proveedores disponibles' }}
                </div>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-3 mb-3">
                <label>Precio por Pieza</label>
                <input type="number" class="form-control" formControlName="precioPieza">
              </div>
              <div class="col-md-3 mb-3">
                <label>Precio por Caja</label>
                <input type="number" class="form-control" formControlName="precioCaja">
              </div>
              <div class="col-md-3 mb-3">
                <label>Piezas por Caja</label>
                <input type="number" class="form-control" formControlName="piezasPorCaja">
              </div>
              <div class="col-md-3 mb-3">
                <label>¿Activo?</label>
                <div class="form-check mt-2">
                  <input type="checkbox" class="form-check-input" formControlName="activo">
                  <label class="form-check-label">Producto Activo</label>
                </div>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-3 mb-3">
                <label>Stock Almacén</label>
                <input type="number" class="form-control" formControlName="stockAlmacen">
              </div>
              <div class="col-md-3 mb-3">
                <label>Stock Exhibición</label>
                <input type="number" class="form-control" formControlName="stockExhibe">
              </div>
              <div class="col-md-3 mb-3">
                <label>Existencia Almacén</label>
                <input type="number" class="form-control" formControlName="existenciaAlmacen">
              </div>
              <div class="col-md-3 mb-3">
                <label>Existencia Exhibición</label>
                <input type="number" class="form-control" formControlName="existenciaExhibe">
              </div>
            </div>
            
            <div class="d-flex justify-content-between">
              <button type="button" class="btn btn-secondary" (click)="limpiarFormulario()">Cancelar</button>
              <button type="submit" class="btn btn-primary" [disabled]="productoForm.invalid">
                {{ modoEdicion ? 'Actualizar' : 'Registrar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Lista de productos -->
      <div *ngIf="!loading">
        <h3>Lista de Productos ({{ productos.length }})</h3>
        
        <div *ngIf="productos.length === 0" class="alert alert-warning">
          No hay productos registrados.
        </div>
        
        <div class="table-responsive">
          <table *ngIf="productos.length > 0" class="table table-striped">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Marca</th>
                <th>Tamaño</th>
                <th>Precio Pieza</th>
                <th>Precio Caja</th>
                <th>Piezas por Caja</th>
                <th>Stock Almacén</th>
                <th>Stock Exhibición</th>
                <th>Existencia Almacén</th>
                <th>Existencia Exhibición</th>
                <th>Proveedores</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let producto of productos">
                <td>{{ producto.codigoBarras }}</td>
                <td>{{ producto.nombre }}</td>
                <td>{{ producto.marca }}</td>
                <td>{{ producto.tamano }}</td>
                <td>{{ producto.precioPieza | currency }}</td>
                <td>{{ producto.precioCaja | currency }}</td>
                <td>{{ producto.piezasPorCaja }}</td>
                <td>{{ producto.stockAlmacen }}</td>
                <td>{{ producto.stockExhibe }}</td>
                <td>{{ producto.existenciaAlmacen }}</td>
                <td>{{ producto.existenciaExhibe }}</td>
                <td>
                  <span *ngFor="let proveedor of getProveedoresArray(producto.proveedores)">
                    {{ getProveedorNombre(proveedor) }}<br>
                  </span>
                </td>
                <td>
                  <span class="badge" [ngClass]="producto.activo ? 'bg-success' : 'bg-danger'">
                    {{ producto.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-info me-2" (click)="editarProducto(producto)">Editar</button>
                  <button class="btn btn-sm btn-warning me-2" (click)="verHistorialPrecios(producto._id!)">Historial</button>
                  <button class="btn btn-sm btn-danger" (click)="eliminarProducto(producto._id!)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table-responsive {
      overflow-x: auto;
    }
  `]
})
export class ProductoCrudComponent implements OnInit {
  productos: Producto[] = [];
  proveedores: Proveedor[] = [];
  marcas: string[] = ['Marca1', 'Marca2', 'Marca3']; // Lista de marcas predeterminadas
  productoForm!: FormGroup;
  loading: boolean = true;
  loadingMessage: string = '';
  loadingProveedores: boolean = true;
  error: boolean = false;
  errorMessage: string = '';
  modoEdicion: boolean = false;
  productoIdEdicion: string | null = null;

  constructor(
    private authService: AuthService,
    private productoService: ProductoService,
    private fb: FormBuilder,
    private router: Router // Agregar Router
  ) {
    if(!this.authService.hasRole(['AlmaceninstaInventario'])){
      this.router.navigate(['/acceso-denegado']);
    }
  }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarDatos();
  }

  inicializarFormulario(): void {
    this.productoForm = this.fb.group({
      codigoBarras: ['', Validators.required],
      nombre: ['', Validators.required],
      tamano: ['Mediano'],
      marca: ['Marca1'], // Marca predeterminada
      precioPieza: [0],
      precioCaja: [0],
      piezasPorCaja: [0],
      stockAlmacen: [0],
      stockExhibe: [0],
      existenciaAlmacen: [0],
      existenciaExhibe: [0],
      proveedores: [[]],
      activo: [true]
    });
  }

  cargarDatos(): void {
    this.loading = true;
    this.error = false;
    this.loadingMessage = 'Cargando productos...';
    
    this.productoService.getAllProductos().subscribe({
      next: (data) => {
        console.log('Productos cargados:', data);
        this.productos = data || [];
        this.cargarProveedores();
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = true;
        this.errorMessage = 'Error al cargar productos: ' + (err.message || JSON.stringify(err));
        this.loading = false;
      }
    });
  }

  cargarProveedores(): void {
    this.loadingMessage = 'Cargando proveedores...';
    this.loadingProveedores = true;
    
    this.productoService.getProveedores().subscribe({
      next: (data) => {
        console.log('Proveedores cargados:', data);
        this.proveedores = data || [];
        this.loadingProveedores = false;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar proveedores:', err);
        this.error = true;
        this.errorMessage = 'Error al cargar proveedores: ' + (err.message || JSON.stringify(err));
        this.loadingProveedores = false;
        this.loading = false;
      }
    });
  }

  limpiarFormulario(): void {
    this.productoForm.reset({
      tamano: 'Mediano',
      marca: 'Marca1',
      precioPieza: 0,
      precioCaja: 0,
      piezasPorCaja: 0,
      stockAlmacen: 0,
      stockExhibe: 0,
      existenciaAlmacen: 0,
      existenciaExhibe: 0,
      proveedores: [],
      activo: true
    });
    this.modoEdicion = false;
    this.productoIdEdicion = null;
  }

  editarProducto(producto: Producto): void {
    this.modoEdicion = true;
    this.productoIdEdicion = producto._id || null;
    
    // Convertir proveedores a un array de IDs
    let proveedoresArray: string[] = [];
    if (producto.proveedores && Array.isArray(producto.proveedores)) {
      proveedoresArray = producto.proveedores.map(p => {
        if (typeof p === 'object' && p !== null && p._id) {
          return p._id;
        }
        return typeof p === 'string' ? p : '';
      }).filter(p => p !== '');
    }
    
    // Normalizar los valores del producto para evitar problemas con valores nulos o indefinidos
    const productoNormalizado = {
      ...producto,
      tamano: producto.tamano || 'Mediano',
      marca: producto.marca || 'Marca1',
      precioPieza: producto.precioPieza || 0,
      precioCaja: producto.precioCaja || 0,
      piezasPorCaja: producto.piezasPorCaja || 0,
      stockAlmacen: producto.stockAlmacen || 0,
      stockExhibe: producto.stockExhibe || 0,
      existenciaAlmacen: producto.existenciaAlmacen || 0,
      existenciaExhibe: producto.existenciaExhibe || 0,
      activo: typeof producto.activo === 'boolean' ? producto.activo : true
    };
    
    // Actualizar el formulario con los valores del producto
    this.productoForm.patchValue({
      codigoBarras: productoNormalizado.codigoBarras,
      nombre: productoNormalizado.nombre,
      tamano: productoNormalizado.tamano,
      marca: productoNormalizado.marca,
      precioPieza: productoNormalizado.precioPieza,
      precioCaja: productoNormalizado.precioCaja,
      piezasPorCaja: productoNormalizado.piezasPorCaja,
      stockAlmacen: productoNormalizado.stockAlmacen,
      stockExhibe: productoNormalizado.stockExhibe,
      existenciaAlmacen: productoNormalizado.existenciaAlmacen,
      existenciaExhibe: productoNormalizado.existenciaExhibe,
      proveedores: proveedoresArray,
      activo: productoNormalizado.activo
    });
  }

  guardarProducto(): void {
    if (this.productoForm.invalid) {
      // Marcar todos los campos como tocados para mostrar errores de validación
      Object.keys(this.productoForm.controls).forEach(key => {
        const control = this.productoForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    // Crear una copia de los datos del formulario
    const productoData = {...this.productoForm.value};
    
    // Asegurarse de que proveedores sea un array
    if (!Array.isArray(productoData.proveedores)) {
      productoData.proveedores = productoData.proveedores ? [productoData.proveedores] : [];
    }
    
    // Actualizar o crear producto según el modo
    if (this.modoEdicion && this.productoIdEdicion) {
      this.productoService.updateProducto(this.productoIdEdicion, productoData).subscribe({
        next: (productoActualizado) => {
          // Actualizar la lista de productos con el producto modificado
          const index = this.productos.findIndex(p => p._id === this.productoIdEdicion);
          if (index !== -1) {
            this.productos[index] = productoActualizado;
          }
          this.limpiarFormulario();
          alert('Producto actualizado correctamente');
        },
        error: (err) => {
          console.error('Error al actualizar producto:', err);
          alert('Error al actualizar el producto: ' + err.message);
        }
      });
    } else {
      this.productoService.createProducto(productoData).subscribe({
        next: (nuevoProducto) => {
          // Añadir el nuevo producto a la lista
          this.productos.push(nuevoProducto);
          this.limpiarFormulario();
          alert('Producto registrado correctamente');
        },
        error: (err) => {
          console.error('Error al crear producto:', err);
          alert('Error al registrar el producto: ' + err.message);
        }
      });
    }
  }

  eliminarProducto(id: string): void {
    if (!id) {
      alert('ID de producto no válido');
      return;
    }
    
    // Confirmar antes de eliminar
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productoService.deleteProducto(id).subscribe({
        next: () => {
          // Eliminar el producto de la lista local
          this.productos = this.productos.filter(p => p._id !== id);
          alert('Producto eliminado correctamente');
        },
        error: (err) => {
          console.error('Error al eliminar producto:', err);
          alert('Error al eliminar el producto: ' + err.message);
        }
      });
    }
  }

  verHistorialPrecios(id: string): void {
    // Navegar a la ruta de historial de precios
    this.router.navigate(['/productos', id, 'historial-precios']);
  }

  // Métodos auxiliares para trabajar con proveedores
  getProveedoresArray(proveedores: any): any[] {
    if (!proveedores) return [];
    return Array.isArray(proveedores) ? proveedores : [proveedores];
  }

  
  getProveedorNombre(proveedor: any): string {
    if (typeof proveedor === 'object' && proveedor !== null && proveedor.nombre) {
      return proveedor.nombre;
    }
    return typeof proveedor === 'string' ? `ID: ${proveedor}` : 'Desconocido';
  }
}