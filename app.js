const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const { errorMiddleware } = require(path.join(
  __dirname,
  'Middlewares',
  'errorHandling.middleware'
));

const { studentRoute } = require('./Routes/student.routes');
const { adminRoute } = require('./Routes/admin.route');

const seeder = require(path.join(__dirname, 'Routes', 'seeding.routes'));

const { userRoute } = require(path.join(__dirname, 'Routes', 'auth.routes'));

const app = express();

app.use(express.json()).use(express.urlencoded({ extended: false }));

app.use(seeder);

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.raw({ type: 'application/pdf', limit: '10mb' }));
app.use(bodyParser.json());

app.use('/smp/register', userRoute);
app.use('/smp/student/', studentRoute);
app.use('/smp/admin/', adminRoute);

app.use(errorMiddleware);

module.exports = {
  app,
};
