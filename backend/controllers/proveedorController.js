const proveedorService = require("../services/proveedorService");

const getAll = async (req, res) => {
  try {
    const proveedores = await proveedorService.getAllProveedores();
    
    if (!proveedores || proveedores.length === 0) {
      console.log('No se encontraron proveedores'); // Para debugging
      return res.status(404).json({
        success: false,
        message: "No se encontraron proveedores en la base de datos",
        data: []
      });
    }

    res.status(200).json({
      success: true,
      message: "Proveedores recuperados exitosamente",
      data: proveedores
    });
  } catch (error) {
    console.error('Error en getAll:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los proveedores",
      error: error.message
    });
  }
};

const getById = async (req, res) => {
  try {
    const proveedor = await proveedorService.getProveedorById(req.params.id);
    
    if (!proveedor) {
      return res.status(404).json({
        success: false,
        message: "Proveedor no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      message: "Proveedor encontrado exitosamente",
      data: proveedor
    });
  } catch (error) {
    console.error('Error en getById:', error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el proveedor",
      error: error.message
    });
  }
};

module.exports = {
  getAll,
  getById,
};
