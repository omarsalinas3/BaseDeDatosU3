import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';

interface Proveedor {
  _id: string;
  nombre: string;
}

@Component({
  selector: 'app-producto-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template:  `
    <div class="boutique-container">
      <div class="header-section">
        <h2 class="main-title">Gestión de Inventario</h2>
      </div>
      
      <div *ngIf="loading" class="status-message info">
        <i class="fas fa-spinner fa-spin"></i> Cargando datos... 
        <span *ngIf="loadingMessage">({{ loadingMessage }})</span>
      </div>
      
      <div *ngIf="error" class="status-message error">
        {{ errorMessage }}
        <button class="btn-retry" (click)="cargarDatos()">Reintentar</button>
      </div>
      
      <!-- Formulario para registrar/editar producto -->
      <div class="product-form-card">
        <div class="form-header">
          {{ modoEdicion ? 'Editar Prenda' : 'Registrar Nueva Prenda' }}
        </div>
        <div class="form-body">
          <form [formGroup]="productoForm" (ngSubmit)="guardarProducto()">
            <div class="form-grid">
              <div class="form-group">
                <label>Código de Barras</label>
                <input type="text" class="boutique-input" formControlName="codigoBarras">
                <div *ngIf="productoForm.get('codigoBarras')?.invalid && productoForm.get('codigoBarras')?.touched" class="error-message">
                  <div *ngIf="productoForm.get('codigoBarras')?.errors?.['required']">Código de barras es requerido</div>
                  <div *ngIf="productoForm.get('codigoBarras')?.errors?.['maxlength']">Código de barras no puede tener más de 10 caracteres</div>
                </div>
              </div>
              <div class="form-group">
                <label>Nombre de la Prenda</label>
                <input type="text" class="boutique-input" formControlName="nombre">
                <div *ngIf="productoForm.get('nombre')?.invalid && productoForm.get('nombre')?.touched" class="error-message">
                  Nombre es requerido
                </div>
              </div>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label>Marca</label>
                <select class="boutique-select" formControlName="marca">
                  <option *ngFor="let marca of marcas" [value]="marca">{{ marca }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Talla</label>
                <select class="boutique-select" formControlName="tamano">
                  <option value="Pequeño">Pequeño</option>
                  <option value="Mediano">Mediano</option>
                  <option value="Grande">Grande</option>
                </select>
              </div>
              <div class="form-group">
                <label>Proveedores</label>
                <select class="boutique-select" formControlName="proveedores" multiple>
                  <option *ngFor="let proveedor of proveedores" [value]="proveedor._id">
                    {{ proveedor.nombre }}
                  </option>
                </select>
                <div *ngIf="proveedores.length === 0" class="warning-message">
                  {{ loadingProveedores ? 'Cargando proveedores...' : 'No hay proveedores disponibles' }}
                </div>
              </div>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label>Precio Unitario</label>
                <input type="number" class="boutique-input" formControlName="precioPieza">
                <div *ngIf="productoForm.get('precioPieza')?.invalid && productoForm.get('precioPieza')?.touched" class="error-message">
                  <div *ngIf="productoForm.get('precioPieza')?.errors?.['max']">El precio no puede ser mayor a 1,000,000</div>
                </div>
              </div>
              <div class="form-group">
                <label>Precio por Lote</label>
                <input type="number" class="boutique-input" formControlName="precioCaja">
              </div>
              <div class="form-group">
                <label>Unidades por Lote</label>
                <input type="number" class="boutique-input" formControlName="piezasPorCaja">
              </div>
              <div class="form-group">
                <label>Estado del Producto</label>
                <div class="switch-container">
                  <label class="switch">
                    <input type="checkbox" formControlName="activo">
                    <span class="slider round"></span>
                  </label>
                  <span class="switch-label">{{ productoForm.get('activo')?.value ? 'Activo' : 'Inactivo' }}</span>
                </div>
              </div>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label>Stock en Bodega</label>
                <input type="number" class="boutique-input" formControlName="stockAlmacen">
                <div *ngIf="productoForm.get('stockAlmacen')?.invalid && productoForm.get('stockAlmacen')?.touched" class="error-message">
                  <div *ngIf="productoForm.get('stockAlmacen')?.errors?.['min']">El stock en bodega no puede ser menor que el stock en tienda</div>
                </div>
              </div>
              <div class="form-group">
                <label>Stock en Tienda</label>
                <input type="number" class="boutique-input" formControlName="stockExhibe">
              </div>
              <div class="form-group">
                <label>Existencia en Bodega</label>
                <input type="number" class="boutique-input" formControlName="existenciaAlmacen">
                <div *ngIf="productoForm.get('existenciaAlmacen')?.invalid && productoForm.get('existenciaAlmacen')?.touched" class="error-message">
                  <div *ngIf="productoForm.get('existenciaAlmacen')?.errors?.['min']">Las existencias en bodega no pueden ser menores que las existencias en tienda</div>
                </div>
              </div>
              <div class="form-group">
                <label>Existencia en Tienda</label>
                <input type="number" class="boutique-input" formControlName="existenciaExhibe">
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn-secondary" (click)="limpiarFormulario()">Cancelar</button>
              <button type="submit" class="btn-primary" [disabled]="productoForm.invalid">
                {{ modoEdicion ? 'Actualizar' : 'Registrar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Lista de productos -->
      <div *ngIf="!loading" class="inventory-section">
        <h3 class="section-title">Catálogo de Productos ({{ productos.length }})</h3>
        
        <div *ngIf="productos.length === 0" class="empty-message">
          No hay productos registrados en el catálogo.
        </div>
        
        <div class="table-container">
          <table *ngIf="productos.length > 0" class="boutique-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Prenda</th>
                <th>Marca</th>
                <th>Talla</th>
                <th>Precio Unit.</th>
                <th>Precio Lote</th>
                <th>Unid/Lote</th>
                <th>Stock Bodega</th>
                <th>Stock Tienda</th>
                <th>Exist. Bodega</th>
                <th>Exist. Tienda</th>
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
                <td class="proveedores-cell">
                  <span *ngFor="let proveedor of getProveedoresArray(producto.proveedores)">
                    {{ getProveedorNombre(proveedor) }}<br>
                  </span>
                </td>
                <td>
                  <span class="status-badge" [class.active]="producto.activo" [class.inactive]="!producto.activo">
                    {{ producto.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="actions-cell">
                  <button class="btn-action edit" (click)="editarProducto(producto)">Editar</button>
                  <button class="btn-action history" (click)="verHistorialPrecios(producto._id!)">Historial</button>
                  <button class="btn-action delete" (click)="eliminarProducto(producto._id!)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .boutique-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      font-family: 'Helvetica Neue', Arial, sans-serif;
    }

    .header-section {
      margin-bottom: 2rem;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 1rem;
    }

    .main-title {
      font-size: 2.5rem;
      color: #333;
      font-weight: 300;
      margin: 0;
    }

    .status-message {
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .status-message.info {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .status-message.error {
      background-color: #ffebee;
      color: #c62828;
    }

    .product-form-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .form-header {
      padding: 1.5rem;
      background: #333;
      color: white;
      font-size: 1.25rem;
      border-radius: 12px 12px 0 0;
    }

    .form-body {
      padding: 2rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #666;
      font-size: 0.9rem;
    }

    .boutique-input, .boutique-select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .boutique-input:focus, .boutique-select:focus {
      border-color: #333;
      outline: none;
    }

    .error-message {
      color: #d32f2f;
      font-size: 0.8rem;
      margin-top: 0.5rem;
    }

    .warning-message {
      color: #f57c00;
      font-size: 0.8rem;
      margin-top: 0.5rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #333;
      color: white;
      border: none;
    }

    .btn-primary:hover {
      background: #555;
    }

    .btn-primary:disabled {
      background: #999;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: white;
      color: #333;
      border: 1px solid #333;
    }

    .btn-secondary:hover {
      background: #f5f5f5;
    }

    .inventory-section {
      margin-top: 3rem;
    }

    .section-title {
      font-size: 1.75rem;
      color: #333;
      margin-bottom: 1.5rem;
    }

    .empty-message {
      text-align: center;
      padding: 2rem;
      background: #f9f9f9;
      border-radius: 8px;
      color: #666;
    }

    .table-container {
      overflow-x: auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .boutique-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
    }

    .boutique-table th {
      background: #f5f5f5;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #333;
    }

    .boutique-table td {
      padding: 1rem;
      border-top: 1px solid #eee;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .status-badge.active {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .status-badge.inactive {
      background: #ffebee;
      color: #c62828;
    }

    .btn-action {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      font-size: 0.8rem;
      margin-right: 0.5rem;
    }

    .btn-action.edit {
      background: #e3f2fd;
      color: #1976d2;
    }

    .btn-action.history {
      background: #fff3e0;
      color: #f57c00;
    }

    .btn-action.delete {
      background: #ffebee;
      color: #c62828;
    }

    /* New switch styles */
    .switch-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .switch {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 34px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
    }

    input:checked + .slider {
      background-color: #333;
    }

    input:checked + .slider:before {
      transform: translateX(26px);
    }

    .slider.round {
      border-radius: 34px;
    }

    .slider.round:before {
      border-radius: 50%;
    }

    .switch-label {
      font-size: 0.9rem;
      color: #666;
    }

    .proveedores-cell {
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .actions-cell {
      white-space: nowrap;
    }
  `]
})
export class ProductoCrudComponent implements OnInit {
  productos: Producto[] = [];
  proveedores: Proveedor[] = [];
  marcas: string[] = ['Zara', 'Adidas', 'H&M', 'Levis', 'Nike', 'Puma', 'Tommy Hilfiger', 'Calvin Klein', 'Versace' ]; // Lista de marcas predeterminadas
  productoForm!: FormGroup;
  loading: boolean = true;
  loadingMessage: string = '';
  loadingProveedores: boolean = true;
  error: boolean = false;
  errorMessage: string = '';
  modoEdicion: boolean = false;
  productoIdEdicion: string | null = null;

  constructor(
    private productoService: ProductoService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarDatos();
  }

  inicializarFormulario(): void {
    this.productoForm = this.fb.group({
      codigoBarras: ['', [Validators.required, Validators.maxLength(10)]],
      nombre: ['', Validators.required],
      tamano: ['Mediano'],
      marca: ['Marca1'],
      precioPieza: [0, [Validators.max(1000000)]],
      precioCaja: [0],
      piezasPorCaja: [0],
      stockAlmacen: [0, [Validators.min(0)]],
      stockExhibe: [0],
      existenciaAlmacen: [0, [Validators.min(0)]],
      existenciaExhibe: [0],
      proveedores: [[]],
      activo: [true]
    }, { validators: [this.stockValidator, this.existenciaValidator] });
  }

  stockValidator(form: FormGroup) {
    const stockAlmacen = form.get('stockAlmacen')?.value;
    const stockExhibe = form.get('stockExhibe')?.value;
    if (stockAlmacen < stockExhibe) {
      form.get('stockAlmacen')?.setErrors({ min: true });
    } else {
      form.get('stockAlmacen')?.setErrors(null);
    }
  }

  existenciaValidator(form: FormGroup) {
    const existenciaAlmacen = form.get('existenciaAlmacen')?.value;
    const existenciaExhibe = form.get('existenciaExhibe')?.value;
    if (existenciaAlmacen < existenciaExhibe) {
      form.get('existenciaAlmacen')?.setErrors({ min: true });
    } else {
      form.get('existenciaAlmacen')?.setErrors(null);
    }
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
    
    let proveedoresArray: string[] = [];
    if (producto.proveedores && Array.isArray(producto.proveedores)) {
      proveedoresArray = producto.proveedores.map((p: string | Proveedor) => {
        if (typeof p === 'object' && p !== null && '_id' in p) {
          return p._id;
        }
        return typeof p === 'string' ? p : '';
      }).filter(p => p !== '');
    }
    
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
      Object.keys(this.productoForm.controls).forEach(key => {
        const control = this.productoForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    const productoData = {...this.productoForm.value};
    
    if (!Array.isArray(productoData.proveedores)) {
      productoData.proveedores = productoData.proveedores ? [productoData.proveedores] : [];
    }
    
    if (this.modoEdicion && this.productoIdEdicion) {
      this.productoService.updateProducto(this.productoIdEdicion, productoData).subscribe({
        next: (productoActualizado) => {
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
    
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productoService.deleteProducto(id).subscribe({
        next: () => {
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
    this.router.navigate(['/productos', id, 'historial-precios']);
  }

  getProveedoresArray(proveedores: any): any[] {
    if (!proveedores) return [];
    return Array.isArray(proveedores) ? proveedores : [proveedores];
  }

  getProveedorNombre(proveedor: any): string {
    if (typeof proveedor === 'object' && proveedor !== null && 'nombre' in proveedor) {
      return proveedor.nombre;
    }
    return typeof proveedor === 'string' ? `ID: ${proveedor}` : 'Desconocido';
  }
  limitarLongitud(event: Event, maxLength: number): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > maxLength) {
      input.value = input.value.slice(0, maxLength); // Trunca el valor
      this.productoForm.get('codigoBarras')?.setValue(input.value); // Actualiza el formulario
    }
  }
}