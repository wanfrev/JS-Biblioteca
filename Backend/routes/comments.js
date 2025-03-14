const express = require('express');
const Comment = require('../models/Comments');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Crear un nuevo comentario
router.post('/', authMiddleware, async (req, res) => {
  const { userId, contentId, comment, rating } = req.body;

  try {
    const newComment = new Comment({ userId, contentId, comment, rating });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los comentarios
router.get('/', authMiddleware, async (req, res) => {
  try {
    const comments = await Comment.find().populate('userId').populate('contentId');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un comentario por ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('userId').populate('contentId');
    if (!comment) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un comentario
router.put('/:id', authMiddleware, async (req, res) => {
  const { comment, rating } = req.body;

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { comment, rating, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }
    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un comentario
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);
    if (!deletedComment) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }
    res.json({ message: 'Comentario eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;