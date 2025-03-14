const express = require('express');
const userRoutes = require('./users');
const commentRoutes = require('./comments');
const movieRoutes = require('./movieseries');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/comments', authMiddleware, commentRoutes);
router.use('/movieseries', authMiddleware, movieRoutes);

module.exports = router;