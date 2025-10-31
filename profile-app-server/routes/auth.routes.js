const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User.model.js');
const { isAuthenticated } = require('../middleware/jwt.middleware.js');

router.post('/signup', async (req, res) => {
  try {
    const foundUsername = await UserModel.findOne({
      username: req.body.username,
    });
    if (foundUsername) {
      return res.status(403).json({ errorMessage: 'This username is taken' });
    } else {
      const salt = await bcryptjs.genSalt(12);
      const hashedPassword = await bcryptjs.hash(req.body.password, salt);
      const createdUser = await UserModel.create({
        username: req.body.username,
        password: hashedPassword,
        campus: req.body.campus,
        course: req.body.course,
      });
      const foundUser = await UserModel.findById(createdUser._id).select(
        'username campus course'
      );
      return res.status(201).json(foundUser);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.post('/login', async (req, res) => {
  try {
    const foundUser = await UserModel.findOne({ username: req.body.username });

    if (!foundUser) {
      res.status(403).json({ errorMessage: 'Invalid Credentials' });
    } else {
      const doesPasswordMatch = bcryptjs.compareSync(
        req.body.password,
        foundUser.password
      );
      if (doesPasswordMatch) {
        const payload = { _id: foundUser._id };

        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: 'HS256',
          expiresIn: '6d',
        });
        res
          .status(200)
          .json({ message: 'You are logged in!', authToken: authToken });
      } else {
        res.status(403).json({ errorMessage: 'Invalid Credentials' });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get('/verify', isAuthenticated, async (req, res) => {
  try {
    const user = await UserModel.findById(req.payload._id).select(
      'username campus course image'
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
