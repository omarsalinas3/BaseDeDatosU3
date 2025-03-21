const Producto = require("../models/Producto");

// Obtener todos los productos
const getAllProductos = async () => {
  return await Producto.find().populate("proveedores");
};

// Crear un nuevo producto
const createProducto = async (productoData) => {
  try {
    const producto = new Producto(productoData);
    await producto.save();
    return producto;
  } catch (error) {
    console.error("Error en createProducto:", error);
    throw error;
  }
};

// Obtener un producto por ID
const getProductoById = async (id) => {
  return await Producto.findById(id).populate("proveedores");
};

// Actualizar un producto por ID
const updateProducto = async (id, productoData) => {
  try {
    // Busca el producto por ID para obtener el precio actual
    const productoActual = await Producto.findById(id);
    
    if (!productoActual) {
      throw new Error("Producto no encontrado");
    }
    
    // Actualiza los campos del producto
    Object.keys(productoData).forEach((key) => {
      productoActual[key] = productoData[key];
    });
    
    // Guarda el producto (esto activará el hook "pre('save')")
    await productoActual.save();
    
    // Poblar los proveedores antes de devolver el producto
    return await Producto.populate(productoActual, { path: "proveedores" });
  } catch (error) {
    console.error("Error en updateProducto:", error);
    throw error;
  }
};

// Eliminar un producto por ID
const deleteProducto = async (id) => {
  return await Producto.findByIdAndDelete(id);
};

// Obtener el historial de precios de un producto
const getHistorialPrecios = async (productoId) => {
  try {
    // Busca el producto por ID y selecciona solo el campo "historialPrecios"
    const producto = await Producto.findById(productoId).select("historialPrecios");
    
    if (!producto) {
      throw new Error("Producto no encontrado");
    }
    
    // Devuelve el historial de precios
    return producto.historialPrecios || [];
  } catch (error) {
    console.error("Error en getHistorialPrecios:", error);
    throw error;
  }
};

module.exports = {
  getAllProductos,
  createProducto,
  getProductoById,
  updateProducto,
  deleteProducto,
  getHistorialPrecios,
};