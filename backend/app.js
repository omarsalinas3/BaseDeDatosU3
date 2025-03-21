const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const productoRoutes = require("./routes/productoRoutes");
const proveedorRoutes = require("./routes/proveedorRoutes");
const loteRoutes = require("./routes/loteRoutes");
const alertaRoutes = require("./routes/alertaRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB
connectDB();

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/lotes", loteRoutes);
app.use("/api/alertas", alertaRoutes);
app.use("/api/usuarios", usuarioRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app