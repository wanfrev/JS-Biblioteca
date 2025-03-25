const express = require('express');
const router = express.Router();

const adminAuthRoutes = require('./adminAuth');
const authMiddleware = require('../middlewares/authMiddleware');
const guestAuthRoutes = require('./guestAuth');

// Aplica el middleware para verificar el token y que sea administrador
router.use('/admin', authMiddleware.verifyToken, authMiddleware.isAdmin);
router.use('/admin', adminAuthRoutes);

// Rutas de guest con verificación de token
router.use('/guest/login', guestAuthRoutes); // Permitir login sin autenticación
router.use('/guest', authMiddleware.verifyToken, authMiddleware.isGuest, guestAuthRoutes);

module.exports = router;