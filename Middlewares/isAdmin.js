const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { AppError } = require(path.join(__dirname, '..', 'Utils', 'appError'));

const jwt = require('jsonwebtoken');

const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7); // Extract the token value after "Bearer "
  }
  return null; // Return null if no token is found
};

const isAdmin = (req, res, next) => {
  const token = getTokenFromHeader(req);
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return new AppError(`${err}`, 403);
      }
      console.log(decoded); // Check the decoded object
      req.user = decoded.user;
      next();
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
module.exports = {
  isAdmin,
};
