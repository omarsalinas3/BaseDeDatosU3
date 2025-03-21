const express = require("express");
const router = express.Router();
const productoController = require("../controllers/productoController");
const { auth } = require("../middlewares/authMiddleware"); // Importación corregida
const Producto = require("../models/Producto"); // Importa el modelo

// Rutas para productos
router.get("/", productoController.getAll);
router.post("/", productoController.create);
router.get("/:id", productoController.getById);
router.put("/:id", productoController.update);
router.delete("/:id", productoController.deleteById);
router.get("/:id/historial-precios", productoController.getHistorialPrecios);
router.get('/cliente', authMiddleware, (req, res) => { // ✅
    Producto.find({activo: true})
    .select('nombre precioPieza codigoBarra marca')
    .then(productos => res.json({success: true, data: productos}))
    .catch(error => res.status(500).json({success: false, message: error.message}));
});

module.exports = router;