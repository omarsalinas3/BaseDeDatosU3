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

    // Procesar imágenes si vienen en el cuerpo
    if (req.body.imagenes && Array.isArray(req.body.imagenes)) {
      req.body.imagenes = req.body.imagenes.map((img, index) => ({
        url: img.url,
        orden: img.orden || index,
        principal: img.principal || false
      }));
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
    // Validar el ID del producto
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "ID de producto no válido" });
    }

    // Validar y convertir proveedores
    if (req.body.proveedores && Array.isArray(req.body.proveedores)) {
      req.body.proveedores = req.body.proveedores.map(prov => {
        // Si es un objeto con _id, usar ese _id
        if (prov && typeof prov === 'object' && prov._id) {
          return mongoose.Types.ObjectId.isValid(prov._id) 
            ? new mongoose.Types.ObjectId(prov._id)
            : prov._id;
        }
        // Si es una cadena, validarla
        else if (typeof prov === 'string') {
          return mongoose.Types.ObjectId.isValid(prov) 
            ? new mongoose.Types.ObjectId(prov)
            : prov;
        }
        return prov;
      });
    }

    // Procesar imágenes
    if (req.body.imagenes && Array.isArray(req.body.imagenes)) {
      req.body.imagenes = req.body.imagenes.map((img, index) => ({
        url: img.url,
        orden: img.orden || index,
        principal: img.principal || false
      }));
    }

    const producto = await productoService.updateProducto(req.params.id, req.body);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json({ data: producto });
  } catch (error) {
    console.error("Error en update:", error);
    res.status(400).json({ 
      error: "Error al actualizar el producto", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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

// Agregar imagen a un producto
const agregarImagen = async (req, res) => {
  try {
    const { url, principal = false } = req.body;
    if (!url) {
      return res.status(400).json({ error: "La URL de la imagen es requerida" });
    }

    const producto = await productoService.agregarImagen(req.params.id, { url, principal });
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json({ data: producto });
  } catch (error) {
    console.error("Error en agregarImagen:", error);
    res.status(500).json({ error: "Error al agregar la imagen", details: error.message });
  }
};

// Eliminar imagen de un producto
const eliminarImagen = async (req, res) => {
  try {
    const { imagenId } = req.params;
    const producto = await productoService.eliminarImagen(req.params.id, imagenId);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json({ data: producto });
  } catch (error) {
    console.error("Error en eliminarImagen:", error);
    res.status(500).json({ error: "Error al eliminar la imagen", details: error.message });
  }
};

module.exports = {
  getAll,
  create,
  getById,
  update,
  deleteById,
  getHistorialPrecios,
  agregarImagen,
  eliminarImagen
};