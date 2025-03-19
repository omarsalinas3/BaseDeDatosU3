const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

// Rutas para usuarios
router.get("/", usuarioController.getAll); // Obtener todos los usuarios
router.get("/:id", usuarioController.getById); // Obtener un usuario por ID

module.exports = router;