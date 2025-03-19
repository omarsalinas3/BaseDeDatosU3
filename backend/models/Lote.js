const mongoose = require("mongoose");

const LoteSchema = new mongoose.Schema({
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
  proveedorId: { type: mongoose.Schema.Types.ObjectId, ref: "Proveedor", required: true },
  cantidad: { type: Number, min: 1, required: true },
  fechaCaducidad: { type: Date, required: true },
  fechaRegistro: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Lote", LoteSchema);