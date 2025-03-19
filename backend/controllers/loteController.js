const loteService = require("../services/loteService");

const getAll = async (req, res) => {
  try {
    const lotes = await loteService.getAllLotes();
    res.status(200).json(lotes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los lotes", details: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const lote = await loteService.getLoteById(req.params.id);
    if (!lote) {
      return res.status(404).json({ error: "Lote no encontrado" });
    }
    res.status(200).json(lote);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el lote", details: error.message });
  }
};

module.exports = {
  getAll,
  getById,
};