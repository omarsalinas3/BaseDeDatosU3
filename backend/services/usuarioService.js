const Usuario = require("../models/Usuario");

// Obtener todos los usuarios
const getAllUsuarios = async () => {
  try {
    const usuarios = await Usuario.find();
    return usuarios;
  } catch (error) {
    console.error('Error en getAllUsuarios:', error);
    throw error;
  }
};

// Obtener un usuario por ID
const getUsuarioById = async (id) => {
  try {
    const usuario = await Usuario.findById(id);
    return usuario;
  } catch (error) {
    console.error('Error en getUsuarioById:', error);
    throw error;
  }
};

module.exports = {
  getAllUsuarios,
  getUsuarioById,
};
