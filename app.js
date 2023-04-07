const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');

const { seeder } = require(path.join(__dirname, 'Routes', 'seeding.route'));

const app = express();

app.use(express.json()).use(express.urlencoded({ extended: false }));

app.use(seeder);

// app.use(errorMiddleware);

module.exports = {
  app,
};
