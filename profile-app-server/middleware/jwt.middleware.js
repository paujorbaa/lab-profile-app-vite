const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    req.payload = payload;
    next();
  } catch (error) {
    console.error('JWT validation error:', error.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { isAuthenticated };
