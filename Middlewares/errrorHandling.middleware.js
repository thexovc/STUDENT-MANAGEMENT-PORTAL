const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const productionFunction = (err, res) => {
  res.status(err.statusCode).json({});
};

const errorMiddleware = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    productionFunction(err, res);
  }
};

module.exports = errorMiddleware;
