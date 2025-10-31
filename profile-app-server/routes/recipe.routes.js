const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe.model');
const { isAuthenticated } = require('../middleware/jwt.middleware');
const fs = require('fs');

const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const upload = multer({ dest: 'uploads/' });
router.post(
  '/new',
  isAuthenticated,
  upload.single('image'),
  async (req, res) => {
    try {
      const { title, description, ingredients, instructions } = req.body;
      let imageUrl = '';

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'recipes',
          transformation: [{ width: 600, height: 400, crop: 'fill' }],
        });
        imageUrl = result.secure_url;
        fs.unlinkSync(req.file.path);
      }

      const newRecipe = await Recipe.create({
        title,
        description,
        ingredients,
        instructions,
        image: imageUrl,
        author: req.payload._id,
      });

      res.status(201).json(newRecipe);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating recipe', error });
    }
  }
);
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('author', 'username image');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes', error });
  }
});

router.get('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId).populate(
      'author',
      'username image'
    );
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipe', error });
  }
});

router.put('/:recipeId', isAuthenticated, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    if (recipe.author.toString() !== req.payload._id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Recipe.findByIdAndUpdate(
      req.params.recipeId,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating recipe', error });
  }
});

router.delete('/:recipeId', isAuthenticated, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    if (recipe.author.toString() !== req.payload._id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recipe', error });
  }
});

module.exports = router;
