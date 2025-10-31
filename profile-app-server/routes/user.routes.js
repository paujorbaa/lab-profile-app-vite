const express = require('express');
const User = require('../models/User.model');
const router = express.Router();
const { isAuthenticated } = require('../middleware/jwt.middleware.js');
const fs = require('fs');
const cloudinary = require('../config/cloudinary.js');
const upload = require('../middleware/upload');
const multer = require('multer');

router.put(
  '/users',
  isAuthenticated,
  upload.single('image'),
  async (req, res) => {
    try {
      const userId = req.payload._id;
      let imageUrl = '';

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'profile_pics',
          transformation: [{ width: 300, height: 300, crop: 'fill' }],
        });
        imageUrl = result.secure_url;
        fs.unlinkSync(req.file.path);
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { image: imageUrl || req.body.image },
        { new: true }
      );

      res.json({ message: 'Profile updated', user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating profile', error });
    }
  }
);
router.post('/profile/:userId', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'user_profiles',
      transformation: [{ width: 300, height: 300, crop: 'fill' }],
    });

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { image: result.secure_url },
      { new: true }
    );

    fs.unlinkSync(req.file.path);

    res.json({
      message: 'Profile photo uploaded successfully',
      imageUrl: result.secure_url,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading profile photo', error });
  }
});

module.exports = router;
