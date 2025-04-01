const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// Ruta protegida: Verificar sesión activa del administrador
router.get("/verify", verifyToken, isAdmin, (req, res) => {
  res.json({ mensaje: "Sesión activa como administrador", user: req.user });
});

// Ruta protegida: Ejemplo de un dashboard para administradores
router.get("/dashboard", verifyToken, isAdmin, (req, res) => {
  res.json({ mensaje: "Bienvenido al panel de administración" });
});

module.exports = router;