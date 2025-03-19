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
      precioAnterior: { type: Number, required: true }, // Solo el precio anterior
      fechaInicio: { type: Date, required: true },
      fechaFin: { type: Date, required: true },
    },
  ],
  activo: { type: Boolean, default: true },
});

// Hook para actualizar el historial de precios antes de guardar
ProductoSchema.pre("save", function (next) {
  if (this.isModified("precioPieza") || this.isModified("precioCaja")) {
    const ahora = new Date();

    // Si ya existe un historial, actualiza la fechaFin del último registro
    if (this.historialPrecios.length > 0) {
      const ultimoRegistro = this.historialPrecios[this.historialPrecios.length - 1];
      ultimoRegistro.fechaFin = ahora;
    }

    // Obtener el valor anterior antes de la modificación
    let precioAnterior;
    if (this.isModified("precioPieza")) {
      precioAnterior = this._original ? this._original.precioPieza : this.precioPieza;
    } else if (this.isModified("precioCaja")) {
      precioAnterior = this._original ? this._original.precioCaja : this.precioCaja;
    }

    // Agregar un nuevo registro al historial con el precio anterior
    this.historialPrecios.push({
      precioAnterior: precioAnterior, // Solo el precio anterior
      fechaInicio: ahora,
      fechaFin: ahora, // La fechaFin se actualizará en el próximo cambio
    });
  }

  next();
});

module.exports = mongoose.model("Producto", ProductoSchema);