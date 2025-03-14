const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');
const { registerSchema, loginSchema } = require('../validators/userValidator');
const router = express.Router();

// Registrar nuevo usuario
router.post('/register', async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword); // Verificar el hash de la contraseña
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET || 'secreto', { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true });
    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar sesión
router.post('/login', async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log('Usuario no encontrado:', username); // Verificar si el usuario no se encuentra
      return res.status(401).json({ error: 'Nombre de usuario o contraseña incorrectos' });
    }

    console.log('Stored Hashed Password:', user.password); // Verificar la contraseña hasheada almacenada
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password Match:', isMatch); // Verificar el resultado de la comparación
    if (!isMatch) {
      console.log('Contraseña incorrecta para el usuario:', username); // Verificar si la contraseña es incorrecta
      return res.status(401).json({ error: 'Nombre de usuario o contraseña incorrectos' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'secreto', { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true });
    res.json({ mensaje: "Inicio de sesión exitoso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta protegida para obtener el perfil del usuario
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cerrar sesión
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ mensaje: "Cierre de sesión exitoso" });
});

module.exports = router;