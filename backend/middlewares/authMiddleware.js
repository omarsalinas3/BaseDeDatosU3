const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Acceso denegado. No se proporcionó un token"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "millavesecreta");
    const usuario = await Usuario.findById(decoded.usuario.id).select("-password");

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: "Token inválido: Usuario no encontrado"
      });
    }

    req.usuario = {
      id: usuario._id,
      nombreUsuario: usuario.nombreUsuario,
      email: usuario.email,
      rol: usuario.rol
    };

    next();
  } catch (error) {
    console.error("Error en auth middleware:", error);
    res.status(401).json({
      success: false,
      message: "Token inválido o expirado"
    });
  }
};

const chequeoRoles = (roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        message: "Autenticación requerida"
      });
    }

    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        success: false,
        message: "Acceso denegado. No tienes permisos suficientes"
      });
    }

    next();
  };
};

module.exports = {
  auth,
  chequeoRoles
};