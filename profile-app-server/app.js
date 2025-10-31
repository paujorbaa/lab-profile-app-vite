require('dotenv').config();

require('./db');

const express = require('express');
const cors = require('cors');
const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

require('./config')(app);

const indexRoutes = require('./routes/index.routes');
app.use('/api', indexRoutes);

const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

const userRoutes = require('./routes/user.routes');
app.use('/api/', userRoutes);

const recipeRoutes = require('./routes/recipe.routes');
app.use('/api/recipes', recipeRoutes);

const commentRoutes = require('./routes/comment.routes');
app.use('/api/comments', commentRoutes);

require('./error-handling')(app);

module.exports = app;
