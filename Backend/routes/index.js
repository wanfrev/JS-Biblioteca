const express = require('express');
const router = express.Router();

const adminAuthRoutes = require('./adminAuth');
const guestAuthRoutes = require('./guestAuth');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas de login (sin autenticación)
router.use('/admin/login', require('./loginAdmin')); // Login de admin
router.use('/guest/login', require('./loginGuest')); // Login de guest

// Rutas protegidas para admin
router.use('/admin', authMiddleware.verifyToken, authMiddleware.isAdmin, adminAuthRoutes);

// Rutas protegidas para guest
router.use('/guest', authMiddleware.verifyToken, authMiddleware.isGuest, guestAuthRoutes);

module.exports = router;