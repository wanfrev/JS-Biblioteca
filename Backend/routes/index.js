const express = require('express');
const router = express.Router();

const adminAuthRoutes = require('./adminAuth');

router.use('/admin', adminAuthRoutes);

module.exports = router;