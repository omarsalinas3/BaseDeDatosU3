// Modelo Producto.model.ts actualizado
export interface HistorialPrecio {
  precioAnterior: number;
  fechaInicio: Date | string;
  fechaFin: Date | string;
  _id: string;
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
}