const Lote = require("../models/Lote");

// Obtener todos los lotes
const getAllLotes = async () => {
  try {
    const lotes = await Lote.find()
      .populate({
        path: "productoId",
        select: "nombre codigoBarras"
      })
      .populate({
        path: "proveedorId",
        select: "nombre telefono email paginaWeb domicilio"
      })
      .exec();

    if (!lotes) {
      throw new Error('No se encontraron lotes');
    }

    return lotes;
  } catch (error) {
    console.error('Error en getAllLotes:', error);
    throw error;
  }
};

// Obtener un lote por ID
const getLoteById = async (id) => {
  try {
    const lote = await Lote.findById(id)
      .populate({
        path: "productoId",
        select: "nombre codigoBarras"
      })
      .populate({
        path: "proveedorId",
        select: "nombre telefono email paginaWeb domicilio"
      })
      .exec();

    if (!lote) {
      throw new Error('Lote no encontrado');
    }

    return lote;
  } catch (error) {
    console.error('Error en getLoteById:', error);
    throw error;
  }
};

module.exports = {
  getAllLotes,
  getLoteById,
};
