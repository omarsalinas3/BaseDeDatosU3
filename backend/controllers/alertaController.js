const alertaService = require("../services/alertaService");

const getAll = async (req, res) => {
  try {
    const alertas = await alertaService.getAllAlertas();
    res.status(200).json(alertas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las alertas" });
  }
};

const getById = async (req, res) => {
  try {
    const alerta = await alertaService.getAlertaById(req.params.id);
    if (!alerta) {
      return res.status(404).json({ error: "Alerta no encontrada" });
    }
    res.status(200).json(alerta);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la alerta" });
  }
};

module.exports = {
  getAll,
  getById,
};