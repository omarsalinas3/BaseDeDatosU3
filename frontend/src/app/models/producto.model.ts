export interface Producto {
  _id?: string;
  codigoBarras: string;
  nombre: string;
  tamano: 'Pequeño' | 'Mediano' | 'Grande';
  marca: string;
  precioPieza: number;
  precioCaja: number;
  piezasPorCaja: number;
  stockAlmacen: number;
  stockExhibe: number;
  existenciaAlmacen: number;
  existenciaExhibe: number;
  proveedores: Array<{ _id: string; nombre: string; }> | string[]; // Puede ser un array de objetos o de strings (IDs)
  historialPrecios?: Array<{
    precioAnterior: number;
    fechaInicio: Date;
    fechaFin: Date;
  }>;
  activo: boolean;
}