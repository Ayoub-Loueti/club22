const jwt = require('jsonwebtoken');
const secretKey = 'ayoub'; 

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization token is missing' });
  }

  const token = authHeader.replace('Bearer ', '');

  jwt.verify(token, secretKey, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    console.log('Decoded Token:', decodedToken);

    req.userId = decodedToken.userId;
    next();
  });
};
