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
    const productoActual = await Producto.findById(id);
    
    if (!productoActual) {
      throw new Error("Producto no encontrado");
    }
    
    Object.keys(productoData).forEach((key) => {
      productoActual[key] = productoData[key];
    });
    
    await productoActual.save();
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
    const producto = await Producto.findById(productoId).select("historialPrecios");
    if (!producto) {
      throw new Error("Producto no encontrado");
    }
    return producto.historialPrecios || [];
  } catch (error) {
    console.error("Error en getHistorialPrecios:", error);
    throw error;
  }
};

// Agregar imagen a un producto
const agregarImagen = async (productoId, imagenData) => {
  try {
    const producto = await Producto.findById(productoId);
    if (!producto) {
      throw new Error("Producto no encontrado");
    }

    // Si la nueva imagen es principal, quitar principal de las demás
    if (imagenData.principal) {
      producto.imagenes.forEach(img => img.principal = false);
    }

    producto.imagenes.push(imagenData);
    await producto.save();
    return producto;
  } catch (error) {
    console.error("Error en agregarImagen:", error);
    throw error;
  }
};

// Eliminar imagen de un producto
const eliminarImagen = async (productoId, imagenId) => {
  try {
    const producto = await Producto.findById(productoId);
    if (!producto) {
      throw new Error("Producto no encontrado");
    }

    producto.imagenes = producto.imagenes.filter(img => img._id.toString() !== imagenId);
    await producto.save();
    return producto;
  } catch (error) {
    console.error("Error en eliminarImagen:", error);
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
  agregarImagen,
  eliminarImagen
};