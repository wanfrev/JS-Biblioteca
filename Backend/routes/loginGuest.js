const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "mi_secreto_super_seguro";

// Iniciar sesión como invitado
router.post("/", (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: "Nombre es requerido" });

  const token = jwt.sign({ nombre, isAdmin: false }, SECRET, { expiresIn: "1h" });

  res.json({ mensaje: "Sesión iniciada como invitado", token });
});

module.exports = router;