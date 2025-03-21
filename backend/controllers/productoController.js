const mongoose = require("mongoose");
const productoService = require("../services/productoService");

// Obtener todos los productos
const getAll = async (req, res) => {
  try {
    const productos = await productoService.getAllProductos();
    res.status(200).json({ data: productos });
  } catch (error) {
    console.error("Error en getAll:", error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};

// Crear un nuevo producto
const create = async (req, res) => {
  try {
    // Convierte las cadenas en el array "proveedores" a ObjectId
    if (req.body.proveedores && Array.isArray(req.body.proveedores)) {
      req.body.proveedores = req.body.proveedores.map((id) => new mongoose.Types.ObjectId(id));
    }

    const nuevoProducto = await productoService.createProducto(req.body);
    res.status(201).json({ data: nuevoProducto });
  } catch (error) {
    console.error("Error en create:", error);
    res.status(400).json({ error: "Error al crear el producto", details: error.message });
  }
};

// Obtener un producto por ID
const getById = async (req, res) => {
  try {
    const producto = await productoService.getProductoById(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json({ data: producto });
  } catch (error) {
    console.error("Error en getById:", error);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
};

// Actualizar un producto por ID
const update = async (req, res) => {
  try {
    // Convierte las cadenas en el array "proveedores" a ObjectId
    if (req.body.proveedores && Array.isArray(req.body.proveedores)) {
      req.body.proveedores = req.body.proveedores.map((id) => new mongoose.Types.ObjectId(id));
    }

    const producto = await productoService.updateProducto(req.params.id, req.body);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json({ data: producto });
  } catch (error) {
    console.error("Error en update:", error);
    res.status(400).json({ error: "Error al actualizar el producto", details: error.message });
  }
};

// Eliminar un producto por ID
const deleteById = async (req, res) => {
  try {
    const producto = await productoService.deleteProducto(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error en deleteById:", error);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
};

// Obtener el historial de precios de un producto por ID
const getHistorialPrecios = async (req, res) => {
  try {
    const historialPrecios = await productoService.getHistorialPrecios(req.params.id);
    res.status(200).json({ data: historialPrecios });
  } catch (error) {
    console.error("Error en getHistorialPrecios:", error);
    res.status(500).json({ error: "Error al obtener el historial de precios" });
  }
};

module.exports = {
  getAll,
  create,
  getById,
  update,
  deleteById,
  getHistorialPrecios,
};