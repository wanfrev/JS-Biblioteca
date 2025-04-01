const express = require("express");
const router = express.Router();
const { verifyToken, isGuest } = require("../middlewares/authMiddleware");

// Ruta protegida: Verificar sesión activa del invitado
router.get("/verify", verifyToken, isGuest, (req, res) => {
  res.json({ mensaje: "Sesión activa como invitado", user: req.user });
});

// Ruta protegida: Ejemplo de un dashboard para invitados
router.get("/dashboard", verifyToken, isGuest, (req, res) => {
  res.json({ mensaje: "Bienvenido al panel de invitados" });
});

module.exports = router;