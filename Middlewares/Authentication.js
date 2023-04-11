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

module.exports = {
  Authenticate,
};
