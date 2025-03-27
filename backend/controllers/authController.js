const authService = require("../services/authService");

// Registramos un nuevo usuario
const registro = async (req, res) => {
    try{
        const nuevoUsuario = await authService.registro(req.body);
        res.status(201).json({ success: true, data: nuevoUsuario });
    }catch (error){
        res.status(400).json({
            success: false,
            message: error.message || "Error al registrar usuario"
        });
    }
};

// Inicio de sesion del usuario
const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Por favor proporciona un correo y una contraseña"
            });
        }

        const authData = await authService.login(email, password);
        res.status(200).json({ success: true, data: authData });
    }catch(error){
        res.status(400).json({
            success: false,
            message: error.message || "Error en la autenticación"
        });
    }
};

//Obtenemos la informacion del usuario actual
const obtenerUsuarioActual = async (req, res) => {
    try{
        res.status(200).json({ success: true, data: req.user });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message || "Error al obtener el usuario actual"
        });
    }
};

module.exports = {
    registro,
    login,
    obtenerUsuarioActual
}