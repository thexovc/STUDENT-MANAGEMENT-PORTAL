const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { AppError } = require(path.join(__dirname, '..', 'Utils', 'appError'));

const jwt = require('jsonwebtoken');

const Authenticate = (req, res, next) => {
  if (req.cookies.id) {
    const newContentId = req.cookies.id;
    jwt.verify(newContentId, process.env.SECRET, (err, decode) => {
      if (err) {
        return new AppError(`${err}`, 403);
      }
      req.user = decode;
      next();
    });
  }
};

module.exports = {
  Authenticate,
};
