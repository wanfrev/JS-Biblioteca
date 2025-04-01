const express = require('express');
const router = express.Router();

const adminAuthRoutes = require('./adminAuth');
const guestAuthRoutes = require('./guestAuth');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas de login (sin autenticación)
router.use('/admin/login', adminAuthRoutes);
router.use('/guest/login', guestAuthRoutes);

// Rutas protegidas para admin
router.use('/admin', adminAuthRoutes);

// Rutas protegidas para guest
router.use('/guest', guestAuthRoutes);

module.exports = router;