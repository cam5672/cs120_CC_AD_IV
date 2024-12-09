const jwt = require('jsonwebtoken');

// Middleware to verify JWT
  exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
      return res.status(401).json({ message: 'No token provided' });
  }
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      next();
  } catch (error) {
      return res.status(403).json({ message: 'Invalid token' });
  }
};

