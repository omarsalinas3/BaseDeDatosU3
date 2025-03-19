const express = require("express");
const router = express.Router();
const loteController = require("../controllers/loteController");

// Rutas para lotes
router.get("/", loteController.getAll); // Obtener todos los lotes
router.get("/:id", loteController.getById); // Obtener un lote por ID

module.exports = router;