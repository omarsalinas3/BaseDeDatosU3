const mongoose = require("mongoose");

const ProveedorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  telefono: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  paginaWeb: { type: String },
  domicilio: {
    calle: { type: String, required: true },
    numeroExterior: { type: String },
    numeroInterior: { type: String },
    colonia: { type: String, required: true },
    codigoPostal: { type: String, required: true },
    ciudad: { type: String, required: true },
  },
}, {
  collection: 'proveedores' // Especificamos explícitamente el nombre de la colección
});

module.exports = mongoose.model("Proveedor", ProveedorSchema);
