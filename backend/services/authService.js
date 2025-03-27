const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registro = async (userData) => {
    try{
        const usuarioExistente = await Usuario.findOne({
            email: userData.email
        });
        if (usuarioExistente){
            throw new Error("El email ya está registrado");
        }

        //Encriptamos la contraseña
        const salt = await bcrypt.genSalt(10);
        const contraseñaEncriptada = await bcrypt.hash(userData.password, salt);

        //Creamos el nuevo usuario
        const usuarioNuevo = new Usuario({
            nombreUsuario: userData.nombreUsuario,
            email: userData.email,
            password: contraseñaEncriptada,
            rol: userData.rol
        });

        //Guardamos al nuevo usuario
        const usuarioGuardado = await usuarioNuevo.save();
        return{
            id: usuarioGuardado._id,
            nombreUsuario: usuarioGuardado.nombreUsuario,
            email: usuarioGuardado.email,
            rol: usuarioGuardado.rol
        };
    }catch(error){
        console.error("Error en registro:", error);
        throw error;
    }
};

const login = async (email, password) => {
    try{
        const usuario = await Usuario.findOne({email});
        if(!usuario){
            throw new Error("Credenciales inválidas");
        }

        //Generamos el token JWT
        const payload = {
            usuario: {
                id: usuario._id,
                rol: usuario.rol,
                nombreUsuario: usuario.nombreUsuario
            }
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || "millavesecreta",
            {expiresIn: "1h"}
        );

        return{
            token,
            usuario:{
                id: usuario._id,
                nombreUsuario: usuario.nombreUsuario,
                email: usuario.email,
                rol: usuario.rol
            }
        };
    }catch(error){
        console.error("Error en login:", error);
        throw error;
    }
};

//Verificamos el funcionamiento del token
const verificarToken = (token) => {
    try{
        return jwt.verify(token, process.env.JWT_SECRET || "millavesecreta");
    }catch (error){
        console.error("Error en verificarToken:", error);
        throw error;
    }
};

module.exports = {
    registro,
    login,
    verificarToken
};