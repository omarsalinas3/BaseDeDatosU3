const mongoose = require("mongoose");

const AlertaSchema = new mongoose.Schema({
  tipo: { type: String, enum: ["Almacén", "Exhibición"], required: true },
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
  mensaje: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  leida: { type: Boolean, default: false },
});

module.exports = mongoose.model("Alerta", AlertaSchema);