const express = require('express');
const Movie = require('../models/MovieSeries');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Crear una nueva película/serie
router.post('/', authMiddleware, async (req, res) => {
  const { externalId, title, originalTitle, categories, releaseDate, synopsis, cast, imageUrl, otherImages, type } = req.body;

  try {
    const newMovie = new Movie({ externalId, title, originalTitle, categories, releaseDate, synopsis, cast, imageUrl, otherImages, type });
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las películas/series
router.get('/', authMiddleware, async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una película/serie por ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Película/Serie no encontrada' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una película/serie
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, originalTitle, categories, releaseDate, synopsis, cast, imageUrl, otherImages, type } = req.body;

  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      { title, originalTitle, categories, releaseDate, synopsis, cast, imageUrl, otherImages, type, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedMovie) {
      return res.status(404).json({ error: 'Película/Serie no encontrada' });
    }
    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar una película/serie
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    if (!deletedMovie) {
      return res.status(404).json({ error: 'Película/Serie no encontrada' });
    }
    res.json({ message: 'Película/Serie eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;