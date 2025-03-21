const mongoose = require("mongoose");

const ProductoSchema = new mongoose.Schema({
  codigoBarras: { type: String, unique: true, required: true },
  nombre: { type: String, required: true },
  tamano: { type: String, enum: ["Pequeño", "Mediano", "Grande"], required: true },
  marca: { type: String, required: true },
  precioPieza: { type: Number, min: 0, required: true },
  precioCaja: { type: Number, min: 0, required: true },
  piezasPorCaja: { type: Number, min: 1, required: true },
  stockAlmacen: { type: Number, min: 0, required: true },
  stockExhibe: { type: Number, min: 0, required: true },
  existenciaAlmacen: { type: Number, min: 0, default: 0 },
  existenciaExhibe: { type: Number, min: 0, default: 0 },
  proveedores: [{ type: mongoose.Schema.Types.ObjectId, ref: "Proveedor" }],
  historialPrecios: [
    {
      precioAnterior: { type: Number, required: true },
      fechaInicio: { type: Date, required: true },
      fechaFin: { type: Date, required: true },
    },
  ],
  activo: { type: Boolean, default: true },
});

// Método para capturar el precio anterior antes de guardar
ProductoSchema.pre("save", async function(next) {
  // Verificar si el precio ha cambiado
  if (this.isModified("precioPieza") || this.isModified("precioCaja")) {
    const ahora = new Date();
    
    // Si ya existe un historial, actualizar la fechaFin del último registro
    if (this.historialPrecios && this.historialPrecios.length > 0) {
      const ultimoRegistro = this.historialPrecios[this.historialPrecios.length - 1];
      ultimoRegistro.fechaFin = ahora;
    }
    
    // Obtener el precio actual antes de la modificación
    let precioAnterior;
    
    if (this.isModified("precioPieza")) {
      // Usar el precio de pieza original si está disponible
      if (this.isNew) {
        // Si es un producto nuevo, usar el valor actual
        precioAnterior = this.precioPieza;
      } else {
        // Para productos existentes, recuperar el valor anterior
        const productoDB = await mongoose.model("Producto").findById(this._id);
        precioAnterior = productoDB ? productoDB.precioPieza : this.precioPieza;
      }
    } else if (this.isModified("precioCaja")) {
      // Usar el precio de caja original si está disponible
      if (this.isNew) {
        // Si es un producto nuevo, usar el valor actual
        precioAnterior = this.precioCaja / this.piezasPorCaja; // Convertir a precio por pieza
      } else {
        // Para productos existentes, recuperar el valor anterior
        const productoDB = await mongoose.model("Producto").findById(this._id);
        precioAnterior = productoDB ? productoDB.precioCaja / productoDB.piezasPorCaja : this.precioCaja / this.piezasPorCaja;
      }
    }
    
    // Agregar un nuevo registro al historial
    if (precioAnterior !== undefined) {
      this.historialPrecios.push({
        precioAnterior: precioAnterior,
        fechaInicio: ahora,
        fechaFin: ahora
      });
    }
  }
  
  next();
});

module.exports = mongoose.model("Producto", ProductoSchema);