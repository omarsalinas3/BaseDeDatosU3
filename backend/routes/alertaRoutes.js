const express = require("express");
const router = express.Router();
const alertaController = require("../controllers/alertaController");

// Rutas para alertas
router.get("/", alertaController.getAll); // Obtener todas las alertas
router.get("/:id", alertaController.getById); // Obtener una alerta por ID

module.exports = router;