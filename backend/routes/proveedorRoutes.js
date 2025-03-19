const express = require("express");
const router = express.Router();
const proveedorController = require("../controllers/proveedorController");

// Rutas para proveedores
router.get("/", proveedorController.getAll); // Obtener todos los proveedores
router.get("/:id", proveedorController.getById); // Obtener un proveedor por ID

module.exports = router;