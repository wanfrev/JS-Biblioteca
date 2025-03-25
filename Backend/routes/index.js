const express = require('express');
const router = express.Router();

const adminAuthRoutes = require('./adminAuth');
const authMiddleware = require('../middlewares/authMiddleware');
const guestAuthRoutes = require('./guestAuth');

router.use('/admin', adminAuthRoutes);
router.use('/admin', authMiddleware);
router.use('/guest', guestAuthRoutes);

module.exports = router;