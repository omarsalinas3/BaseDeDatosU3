import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, timeout, tap, map } from 'rxjs';
import { Producto, ImagenProducto } from '../models/producto.model';

// Interface for provider response
interface ProveedorResponse {
  _id: string;
  nombre: string;
  // Add other provider properties if needed
}

// Interface para el historial de precios
interface HistorialPrecio {
  precioAnterior: number;
  fechaInicio: Date;
  fechaFin: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:3000/api/productos';
  private proveedoresUrl = 'http://localhost:3000/api/proveedores';

  constructor(private http: HttpClient) {
    console.log('ProductoService inicializado - API URLs:', {
      productos: this.apiUrl,
      proveedores: this.proveedoresUrl
    });
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  getAllProductos(): Observable<Producto[]> {
    console.log('Solicitando productos a:', this.apiUrl);
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log('Respuesta del servidor (productos):', response)),
        map(response => {
          if (response && response.data && Array.isArray(response.data)) {
            return response.data;
          } else if (Array.isArray(response)) {
            return response;
          } else {
            console.warn('Formato de respuesta inesperado para productos:', response);
            return [];
          }
        }),
        timeout(15000),
        catchError(this.handleError)
      );
  }

  getProductoById(id: string): Observable<Producto> {
    console.log(`Solicitando producto con ID: ${id}`);
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log('Respuesta del servidor (producto):', response)),
        map(response => response && response.data ? response.data : response),
        timeout(15000),
        catchError(this.handleError)
      );
  }

  getProductosParaClientes(): Observable<Producto[]> {
    return this.http.get<any>(`http://localhost:3000/api/productos/cliente`, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          if (response && response.success && response.data) {
            return response.data; // Extrae el array de productos
          }
          return [];
        }),
        catchError(this.handleError)
      );
  }

  getHistorialPrecios(id: string): Observable<HistorialPrecio[]> {
    console.log(`Solicitando historial de precios para producto ID: ${id}`);
    return this.http.get<any>(`${this.apiUrl}/${id}/historial-precios`, { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log('Respuesta del servidor (historial):', response)),
        map(response => {
          if (response && response.data && Array.isArray(response.data)) {
            return response.data;
          } else if (Array.isArray(response)) {
            return response;
          } else {
            console.warn('Formato de respuesta inesperado para historial:', response);
            return [];
          }
        }),
        timeout(15000),
        catchError(this.handleError)
      );
  }

  getProveedores(): Observable<Array<{ _id: string; nombre: string; }>> {
    console.log('Solicitando proveedores a:', this.proveedoresUrl);
    return this.http.get<any>(this.proveedoresUrl, { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log('Respuesta del servidor (proveedores):', response)),
        map(response => {
          if (response && response.data && Array.isArray(response.data)) {
            return response.data.map((proveedor: ProveedorResponse) => ({
              _id: proveedor._id,
              nombre: proveedor.nombre
            }));
          } else if (Array.isArray(response)) {
            return response.map((proveedor: ProveedorResponse) => ({
              _id: proveedor._id,
              nombre: proveedor.nombre
            }));
          } else {
            console.warn('Formato de respuesta inesperado para proveedores:', response);
            return [];
          }
        }),
        timeout(15000),
        catchError(this.handleError)
      );
  }

  createProducto(producto: Producto): Observable<Producto> {
    console.log('Enviando nuevo producto:', producto);
    return this.http.post<any>(this.apiUrl, producto, { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log('Producto creado:', response)),
        map(response => response && response.data ? response.data : response),
        catchError(this.handleError)
      );
  }

  updateProducto(id: string, producto: Producto): Observable<Producto> {
    console.log(`Actualizando producto ${id}:`, producto);
    return this.http.put<any>(`${this.apiUrl}/${id}`, producto, { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log('Producto actualizado:', response)),
        map(response => response && response.data ? response.data : response),
        catchError(this.handleError)
      );
  }

  deleteProducto(id: string): Observable<any> {
    console.log(`Eliminando producto ${id}`);
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log('Respuesta eliminación:', response)),
        catchError(this.handleError)
      );
  }

  // Nuevos métodos para manejo de imágenes
  agregarImagen(productoId: string, imagenData: ImagenProducto): Observable<Producto> {
    console.log(`Agregando imagen al producto ${productoId}:`, imagenData);
    return this.http.post<any>(`${this.apiUrl}/${productoId}/imagenes`, imagenData, { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log('Imagen agregada:', response)),
        map(response => response && response.data ? response.data : response),
        catchError(this.handleError)
      );
  }

  eliminarImagen(productoId: string, imagenId: string): Observable<Producto> {
    console.log(`Eliminando imagen ${imagenId} del producto ${productoId}`);
    return this.http.delete<any>(`${this.apiUrl}/${productoId}/imagenes/${imagenId}`, { headers: this.getHeaders() })
      .pipe(
        tap(response => console.log('Imagen eliminada:', response)),
        map(response => response && response.data ? response.data : response),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error completo:', error);
    
    let errorMsg = 'Error en la comunicación con el servidor';
    
    if (error.status === 0) {
      errorMsg = 'Error de conexión: El servidor no responde';
    } else if (error.status === 404) {
      errorMsg = 'Recurso no encontrado';
    } else if (error.error?.message) {
      errorMsg = error.error.message;
    } else {
      errorMsg = `Error ${error.status}: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMsg));
  }
    
    
  
  }
  
