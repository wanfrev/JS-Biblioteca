const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db/db");
const { loginSchema } = require("../validators/userValidator");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "secreto";

// Iniciar sesión como administrador
router.post("/login", async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { username, password } = req.body;

  try {
    const [user] = await db.query("SELECT * FROM admin WHERE ad_nom = ?", [username]);

    if (user.length === 0) {
      return res.status(401).json({ error: "Nombre de usuario o contraseña incorrectos" });
    }

    const isMatch = await bcrypt.compare(password, user[0].ad_pass);
    if (!isMatch) {
      return res.status(401).json({ error: "Nombre de usuario o contraseña incorrectos" });
    }

    const token = jwt.sign(
      {
        id: user[0].id_admin,
        username: user[0].ad_nom,
        isAdmin: true,
      },
      SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });
    res.json({ mensaje: "Inicio de sesión exitoso", isAdmin: true });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Verificar sesión activa del admin
router.get("/verify", verifyToken, isAdmin, (req, res) => {
  res.json({ mensaje: "Sesión activa como administrador", user: req.user });
});

// Cerrar sesión
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ mensaje: "Sesión cerrada correctamente" });
});

module.exports = router;
