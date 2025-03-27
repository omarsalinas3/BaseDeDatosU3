// Modelo Producto.model.ts actualizado con imágenes
export interface HistorialPrecio {
  precioAnterior: number;
  fechaInicio: Date | string;
  fechaFin: Date | string;
  _id: string;
}

export interface ImagenProducto {
  url: string;
  orden?: number;
  principal?: boolean;
  _id?: string;
}

export interface Producto {
  _id: string;
  codigoBarras: string;
  nombre: string;
  tamano: string;
  marca: string;
  precioPieza: number;
  precioCaja: number;
  piezasPorCaja: number;
  stockAlmacen: number;
  stockExhibe: number;
  existenciaAlmacen: number;
  existenciaExhibe: number;
  proveedores: Array<string | { _id: string; nombre: string }>;
  activo: boolean;
  historialPrecios?: HistorialPrecio[];
  imagenes?: ImagenProducto[];
  categoria?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}