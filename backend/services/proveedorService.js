// proveedorService.js
const Proveedor = require("../models/Proveedor");

const getAllProveedores = async () => {
  try {
    const proveedores = await Proveedor.find({}, '_id nombre').lean().exec();
    console.log('Proveedores encontrados:', proveedores);
    return proveedores;
  } catch (error) {
    console.error('Error en getAllProveedores:', error);
    throw error;
  }
};

const getProveedorById = async (id) => {
  try {
    const proveedor = await Proveedor.findById(id, '_id nombre').lean().exec();
    console.log('Proveedor encontrado:', proveedor);
    return proveedor;
  } catch (error) {
    console.error('Error en getProveedorById:', error);
    throw error;
  }
};

module.exports = {
  getAllProveedores,
  getProveedorById,
};
