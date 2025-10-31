const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment.model');
const Recipe = require('../models/Recipe.model');
const { isAuthenticated } = require('../middleware/jwt.middleware');

router.post('/:recipeId', isAuthenticated, async (req, res) => {
  try {
    const { text } = req.body;
    const recipeId = req.params.recipeId;

    const recipeExists = await Recipe.findById(recipeId);
    if (!recipeExists)
      return res.status(404).json({ message: 'Recipe not found' });

    const comment = await Comment.create({
      recipe: recipeId,
      author: req.payload._id,
      text,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error });
  }
});

router.get('/:recipeId', async (req, res) => {
  try {
    const comments = await Comment.find({ recipe: req.params.recipeId })
      .populate('author', 'username image')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error });
  }
});

router.delete('/:commentId', isAuthenticated, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.author.toString() !== req.payload._id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error });
  }
});

module.exports = router;
