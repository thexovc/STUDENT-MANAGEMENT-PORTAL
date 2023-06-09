const mongoose = require('mongoose');

const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Db = () => {
  mongoose
    .connect(process.env.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('connected and running');
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = Db;
