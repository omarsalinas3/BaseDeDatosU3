import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSignOutAlt, faSpinner, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

interface Proveedor {
  _id: string;
  nombre: string;
}

interface ImagenProducto {
  url: string;
  orden?: number;
  principal?: boolean;
  _id?: string;
}

@Component({
  selector: 'app-producto-crud',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  templateUrl: './producto-crud.component.html',
  styleUrls: ['./producto-crud.component.css']
})
export class ProductoCrudComponent implements OnInit {
  // Iconos de FontAwesome
  faSignOutAlt = faSignOutAlt;
  faSpinner = faSpinner;
  faExclamationCircle = faExclamationCircle;

  productos: Producto[] = [];
  proveedores: Proveedor[] = [];
  marcas: string[] = ['Zara', 'Adidas', 'H&M', 'Levis', 'Nike', 'Puma', 'Tommy Hilfiger', 'Calvin Klein', 'Versace'];
  categorias: string[] = ['Camisas', 'Pantalones', 'Vestidos', 'Zapatos', 'Accesorios'];
  productoForm!: FormGroup;
  loading: boolean = true;
  loadingMessage: string = '';
  loadingProveedores: boolean = true;
  error: boolean = false;
  errorMessage: string = '';
  modoEdicion: boolean = false;
  productoIdEdicion: string | null = null;
  nuevaImagenUrl: string = '';
  imagenPrincipalSeleccionada: string | null = null;
  imagenesEditando: ImagenProducto[] = [];

  constructor(
    public authService: AuthService,
    private productoService: ProductoService,
    private fb: FormBuilder,
    private router: Router
  ) {
    if(!this.authService.hasRole(['AlmacenistaInventario'])){
      this.router.navigate(['/acceso-denegado']);
    }
  }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarDatos();
  }

  inicializarFormulario(): void {
    this.productoForm = this.fb.group({
      codigoBarras: ['', [Validators.required, Validators.maxLength(10)]],
      nombre: ['', Validators.required],
      tamano: ['Mediano'],
      marca: ['Zara'],
      categoria: ['Camisas'],
      precioPieza: [0, [Validators.max(1000000)]],
      precioCaja: [0],
      piezasPorCaja: [0],
      stockAlmacen: [0, [Validators.min(0)]],
      stockExhibe: [0],
      existenciaAlmacen: [0, [Validators.min(0)]],
      existenciaExhibe: [0],
      proveedores: [[]],
      activo: [true],
      imagenes: [[]]
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
      marca: 'Zara',
      categoria: 'Camisas',
      precioPieza: 0,
      precioCaja: 0,
      piezasPorCaja: 0,
      stockAlmacen: 0,
      stockExhibe: 0,
      existenciaAlmacen: 0,
      existenciaExhibe: 0,
      proveedores: [],
      activo: true,
      imagenes: []
    });
    this.modoEdicion = false;
    this.productoIdEdicion = null;
    this.imagenesEditando = [];
    this.imagenPrincipalSeleccionada = null;
    this.nuevaImagenUrl = '';
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

    this.imagenesEditando = producto.imagenes ? [...producto.imagenes] : [];
    if (producto.imagenes && producto.imagenes.length > 0) {
      const principal = producto.imagenes.find(img => img.principal);
      this.imagenPrincipalSeleccionada = principal ? principal._id || principal.url : null;
    }
    
    const productoNormalizado = {
      ...producto,
      tamano: producto.tamano || 'Mediano',
      marca: producto.marca || 'Zara',
      categoria: producto.categoria || 'Camisas',
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
      categoria: productoNormalizado.categoria,
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

  agregarImagen(): void {
    if (!this.nuevaImagenUrl) {
      alert('Por favor ingresa una URL válida');
      return;
    }

    const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    if (!urlPattern.test(this.nuevaImagenUrl)) {
      alert('La URL de la imagen no es válida');
      return;
    }

    const nuevaImagen: ImagenProducto = {
      url: this.nuevaImagenUrl,
      principal: this.imagenesEditando.length === 0
    };

    this.imagenesEditando.push(nuevaImagen);
    this.nuevaImagenUrl = '';

    if (this.imagenesEditando.length === 1) {
      this.imagenPrincipalSeleccionada = nuevaImagen.url;
    }
  }

  eliminarImagen(index: number): void {
    this.imagenesEditando.splice(index, 1);
    if (this.imagenPrincipalSeleccionada && this.imagenesEditando.length > 0) {
      if (!this.imagenesEditando.some(img => img.url === this.imagenPrincipalSeleccionada || img._id === this.imagenPrincipalSeleccionada)) {
        this.imagenPrincipalSeleccionada = this.imagenesEditando[0]._id || this.imagenesEditando[0].url;
      }
    } else if (this.imagenesEditando.length === 0) {
      this.imagenPrincipalSeleccionada = null;
    }
  }

  marcarComoPrincipal(index: number): void {
    const imagen = this.imagenesEditando[index];
    this.imagenPrincipalSeleccionada = imagen._id || imagen.url;
  }

  guardarProducto(): void {
    if (this.productoForm.invalid) {
      Object.keys(this.productoForm.controls).forEach(key => {
        const control = this.productoForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    const imagenesParaGuardar = this.imagenesEditando.map((img, index) => ({
      url: img.url,
      orden: index,
      principal: (img._id ? img._id === this.imagenPrincipalSeleccionada : img.url === this.imagenPrincipalSeleccionada)
    }));

    const productoData = {
      ...this.productoForm.value,
      imagenes: imagenesParaGuardar
    };
    
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

  getImagenPrincipal(producto: Producto): string {
    if (producto.imagenes && producto.imagenes.length > 0) {
      const principal = producto.imagenes.find(img => img.principal);
      return principal ? principal.url : producto.imagenes[0].url;
    }
    return 'https://via.placeholder.com/300x300.png?text=Sin+imagen';
  }

  limitarLongitud(event: Event, maxLength: number): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > maxLength) {
      input.value = input.value.slice(0, maxLength);
      this.productoForm.get('codigoBarras')?.setValue(input.value);
    }
  }
}