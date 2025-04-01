const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { verifyToken, isGuest } = require('../middlewares/authMiddleware');

const SECRET = process.env.JWT_SECRET || 'mi_secreto_super_seguro';

// POST /api/guest/login
router.post('/login', (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Nombre es requerido' });

  const token = jwt.sign({ nombre, isAdmin: false }, SECRET, { expiresIn: '1h' });

  res.cookie('token', token, { httpOnly: true });
  res.json({ mensaje: 'Sesión iniciada como invitado' });
});

// GET /api/guest/verify
router.get('/verify', verifyToken, isGuest, (req, res) => {
  res.json({ mensaje: 'Sesión activa como invitado', user: req.user });
});

module.exports = router;
