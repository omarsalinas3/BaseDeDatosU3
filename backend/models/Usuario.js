const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ["Cliente", "AlmacenistaInventario", "AlmacenistaExhibidor"], required: true },
});

module.exports = mongoose.model("Usuario", UsuarioSchema);