const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { verifyToken, isGuest } = require('../middlewares/authMiddleware');

const SECRET = process.env.JWT_SECRET || 'mi_secreto_super_seguro';

// POST /api/guest/login
router.post('/login', (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Nombre es requerido' });

  res.json({ mensaje: 'Sesión iniciada como invitado' });
});

module.exports = router;
