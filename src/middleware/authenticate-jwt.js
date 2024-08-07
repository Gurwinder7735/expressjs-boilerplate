const jwt = require('jsonwebtoken');
const AppError = require('../utils/error-handlers/app-error');

// Middleware function to validate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (token) {
    jwt.verify(token, process.env.JWT_PUBLIC_KEY, (err, decoded) => {
      if (err) {
        throw err;
      }
      // Extract user ID from the decoded token
      const userId = decoded.sub;
      req.user = {
        id: userId,
      };
      next();
    });
  } else {
    throw new AppError('Token not found', 403);
  }
};

module.exports = authenticateJWT;
