const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db/db'); // Importar el pool de conexiones
const { loginSchema } = require('../validators/userValidator');
const router = express.Router();

// Iniciar sesión como administrador
router.post('/login', async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { username, password } = req.body;

  try {
    // Realizar la consulta a la base de datos
    const [user] = await db.query('SELECT * FROM admin WHERE ad_nom = ?', [username]);
    if (user.length === 0) {
      console.log('Usuario no encontrado:', username); // Verificar si el usuario no se encuentra
      return res.status(401).json({ error: 'Nombre de usuario o contraseña incorrectos' });
    }

    console.log('Contraseña almacenada:', user[0].ad_pass); // Verificar la contraseña almacenada
    if (password !== user[0].ad_pass) {
      console.log('Contraseña incorrecta para el usuario:', username); // Verificar si la contraseña es incorrecta
      return res.status(401).json({ error: 'Nombre de usuario o contraseña incorrectos' });
    }

    const token = jwt.sign({ id: user[0].id_admin, username: user[0].ad_nom, isAdmin: true }, process.env.JWT_SECRET || 'secreto', { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true });
    res.json({ mensaje: "Inicio de sesión exitoso", isAdmin: true }); // Añadir isAdmin a la respuesta
  } catch (error) {
    console.error("Error en el servidor:", error); // Verificar si hay errores en el backend
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;