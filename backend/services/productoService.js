const Producto = require("../models/Producto");

// Obtener todos los productos
const getAllProductos = async () => {
  return await Producto.find().populate("proveedores"); // Corregido: "proveedores"
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
  return await Producto.findById(id).populate("proveedores"); // Corregido: "proveedores"
};

// Actualizar un producto por ID
const updateProducto = async (id, productoData) => {
  try {
    // Busca el producto por ID
    const producto = await Producto.findById(id);

    if (!producto) {
      throw new Error("Producto no encontrado");
    }

    // Actualiza los campos del producto
    Object.keys(productoData).forEach((key) => {
      producto[key] = productoData[key];
    });

    // Guarda el producto (esto activará el hook "pre('save')")
    await producto.save();

    // Poblar los proveedores antes de devolver el producto
    return await Producto.populate(producto, { path: "proveedores" }); // Corregido: "proveedores"
  } catch (error) {
    console.error("Error en updateProducto:", error);
    throw error;
  }
};

// Eliminar un producto por ID
const deleteProducto = async (id) => {
  return await Producto.findByIdAndDelete(id);
};

module.exports = {
  getAllProductos,
  createProducto,
  getProductoById,
  updateProducto,
  deleteProducto,
};