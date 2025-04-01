const express = require('express');
const jwt = require('jsonwebtoken');
const { verifyToken, isGuest } = require('../middlewares/authMiddleware');

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'mi_secreto_super_seguro';

// Login de invitado
router.post('/login', (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Nombre es requerido' });

  const token = jwt.sign({ nombre, isAdmin: false }, SECRET, { expiresIn: '1h' });

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false
  }).json({ mensaje: 'Sesión iniciada como invitado' });
});

// Verificar sesión de invitado
router.get('/verify', verifyToken, isGuest, (req, res) => {
  res.json({ mensaje: 'Sesión activa como invitado', user: req.user });
});

// ✅ Cerrar sesión
router.post('/logout', (req, res) => {
  res.clearCookie('token').json({ mensaje: 'Sesión cerrada correctamente' });
});

module.exports = router;
