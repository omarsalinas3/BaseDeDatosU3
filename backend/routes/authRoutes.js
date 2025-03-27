const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { auth, chequeoRoles } = require("../middlewares/authMiddleware");

//Rutas publicas para el registro y el login
router.post("/registro", authController.registro);
router.post("/login", authController.login);

//Rutas protegidas para el usuario
router.get("/me", auth, authController.obtenerUsuarioActual);

//Rutas protegidas para el rol
router.get("/cliente", auth, chequeoRoles(["Cliente"]), (req, res) => {
    res.json({ message: "Acceso concedido para el rol de Cliente" });
}
);

router.get("/almacenista-investario", auth, chequeoRoles(["AlmacenistaInventario"]), (req, res) => {
    res.json({ message: "Acceso como Almacenista de Inventario concedido" });
}
);

router.get("/almacenista-exhibidor", auth, chequeoRoles(["AlmacenistaExhibidor"]), (req, res) => {
    res.json({ message: "Acceso como Almacenista de Exhibidor concedido" });
}
);

module.exports = router;