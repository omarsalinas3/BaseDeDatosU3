const express = require("express");
const router = express.Router();
const productoController = require("../controllers/productoController");

// Rutas para productos
router.get("/", productoController.getAll); // Obtener todos los productos
router.post("/", productoController.create); // Crear un nuevo producto
router.get("/:id", productoController.getById); // Obtener un producto por ID
router.put("/:id", productoController.update); // Actualizar un producto por ID
router.delete("/:id", productoController.deleteById); // Eliminar un producto por ID
router.get('/cliente', authMiddleware, (req, res) => {
    Producto.find({activo: true})
    .select('nombre precioPieza codigoBarra marca')
    .then(productos => res.json({success: true, data: productos}))
    .catch(error => res.status(500).json({success: false, message: error.message}));
})

module.exports = router;