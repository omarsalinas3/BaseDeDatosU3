const express = require("express");
const router = express.Router();
const productoController = require("../controllers/productoController");
const { auth } = require("../middlewares/authMiddleware");
const Producto = require("../models/Producto");

// Rutas para productos
router.get("/", productoController.getAll);
router.post("/", productoController.create);

// Ruta para clientes - DEBE ESTAR ANTES DE LAS RUTAS CON :id
router.get('/cliente', auth, (req, res) => {
    Producto.find({ activo: true })
        .select('nombre precioPieza codigoBarras marca imagenes categoria stockExhibe tamano') // <-- Agrega los campos faltantes
        .populate('proveedores', 'nombre')
        .then(productos => res.json({ success: true, data: productos }))
        .catch(error => {
            console.error('Error en /cliente:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al obtener productos para cliente',
                error: error.message 
            });
        });
});

// Rutas que usan :id - DEBEN ESTAR DESPUÉS DE LAS RUTAS ESPECÍFICAS
router.get("/:id", productoController.getById);
router.put("/:id", productoController.update);
router.delete("/:id", productoController.deleteById);
router.get("/:id/historial-precios", productoController.getHistorialPrecios);

// Rutas para manejo de imágenes
router.post("/:id/imagenes", productoController.agregarImagen);
router.delete("/:id/imagenes/:imagenId", productoController.eliminarImagen);

module.exports = router;