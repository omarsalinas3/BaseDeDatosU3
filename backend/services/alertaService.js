const Alerta = require("../models/Alerta");

// Obtener todas las alertas
const getAllAlertas = async () => {
  return await Alerta.find().populate("productoId");
};

// Obtener una alerta por ID
const getAlertaById = async (id) => {
  return await Alerta.findById(id).populate("productoId");
};

module.exports = {
  getAllAlertas,
  getAlertaById,
};