const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { AppError } = require(path.join(__dirname, '..', 'Utils', 'appError'));

const jwt = require('jsonwebtoken');

const Authenticate = (req, res, next) => {
  if (req.cookie.id) {
    const contentId = req.headers.cookie.split(';')[0];
    const newContentId = contentId.split('value=')[1];
    jwt.verify(newContentId, process.env.SECRET, (err, decode) => {
      if (err) {
        return new AppError(`${err}`, 403);
      }
      next();
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.role === 'super admin' || req.role === 'admin') {
    next();
  }
  next(new (AppError('you are not authorized to visit this route', 401)));
};

module.exports = {
  Authenticate,
  isAdmin,
};
