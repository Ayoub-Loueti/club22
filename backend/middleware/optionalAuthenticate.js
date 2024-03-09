const jwt = require('jsonwebtoken');
const secretKey = 'ayoub'; // Ensure you're using the same secret key as elsewhere

// Optional authentication middleware
const optionalAuthenticate = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  // Proceed without authentication if no Authorization header is present
  if (!authHeader) {
    return next();
  }

  const token = authHeader.replace('Bearer ', '');
  jwt.verify(token, secretKey, (err, decodedToken) => {
    // If token is valid, set userId, otherwise ignore the error
    if (!err && decodedToken) {
      req.userId = decodedToken.userId;
    }
    next();
  });
};

module.exports = optionalAuthenticate;
