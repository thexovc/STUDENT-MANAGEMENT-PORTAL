const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const store = require('./Routes/auth.routes');

const app = express();

app.use(express.json()).use(express.urlencoded({ extended: false }));

app.use(store);

// app.use(errorMiddleware);

module.exports = {
  app,
};
