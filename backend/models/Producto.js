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
  imagenes: [{
    url: { 
      type: String, 
      required: true,
      match: [/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'URL inválida']
    },
    orden: { type: Number, default: 0 },
    principal: { type: Boolean, default: false }
  }],
  categoria: { type: String, enum: ["Camisas", "Pantalones", "Vestidos", "Zapatos", "Accesorios"], required: true }
}, { timestamps: true });

// Método para capturar el precio anterior antes de guardar
ProductoSchema.pre("save", async function(next) {
  // Verificar si el precio ha cambiado
  if ((this.isModified("precioPieza") || this.isModified("precioCaja")) && !this.isNew) {
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
        precioAnterior = this.precioPieza;
      } else {
        const productoDB = await mongoose.model("Producto").findById(this._id);
        precioAnterior = productoDB ? productoDB.precioPieza : this.precioPieza;
      }
    } else if (this.isModified("precioCaja")) {
      if (this.isNew) {
        precioAnterior = this.precioCaja / this.piezasPorCaja;
      } else {
        const productoDB = await mongoose.model("Producto").findById(this._id);
        precioAnterior = productoDB ? productoDB.precioCaja / productoDB.piezasPorCaja : this.precioCaja / this.piezasPorCaja;
      }
    }
    
    if (precioAnterior !== undefined) {
      this.historialPrecios.push({
        precioAnterior: precioAnterior,
        fechaInicio: ahora,
        fechaFin: ahora
      });
    }
  }
  
  // Validar que solo haya una imagen principal
  if (this.isModified('imagenes')) {
    const principales = this.imagenes.filter(img => img.principal);
    if (principales.length > 1) {
      throw new Error('Solo puede haber una imagen principal');
    }
  }
  
  next();
});

// Método para obtener la imagen principal
ProductoSchema.methods.getImagenPrincipal = function() {
  const principal = this.imagenes.find(img => img.principal);
  return principal ? principal.url : (this.imagenes.length > 0 ? this.imagenes[0].url : 'https://via.placeholder.com/300x300.png?text=Sin+imagen');
};

module.exports = mongoose.model("Producto", ProductoSchema);