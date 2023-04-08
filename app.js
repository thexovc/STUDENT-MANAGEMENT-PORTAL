const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const { errorMiddleware } = require(path.join(
  __dirname,
  'Middlewares',
  'errorHandling.middleware'
));

const express = require('express');

const seeder = require(path.join(__dirname, 'Routes', 'seeding.routes'));

const { userRoute } = require(path.join(__dirname, 'Routes', 'auth.routes'));

const app = express();

app.use(express.json()).use(express.urlencoded({ extended: false }));

app.use(seeder);

app.use('/smp/register', userRoute);

app.use(errorMiddleware);

module.exports = {
  app,
};
