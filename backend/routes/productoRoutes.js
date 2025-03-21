const express = require("express");
const router = express.Router();
const productoController = require("../controllers/productoController");

// Rutas para productos
router.get("/", productoController.getAll); // Obtener todos los productos
router.post("/", productoController.create); // Crear un nuevo producto
router.get("/:id", productoController.getById); // Obtener un producto por ID
router.put("/:id", productoController.update); // Actualizar un producto por ID
router.delete("/:id", productoController.deleteById); // Eliminar un producto por ID
router.get("/:id/historial-precios", productoController.getHistorialPrecios);

module.exports = router;