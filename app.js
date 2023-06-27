const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const { errorMiddleware } = require(path.join(
  __dirname,
  'Middlewares',
  'errorHandling.middleware'
));

const { studentRoute } = require('./Routes/student.routes');
const { adminRoute } = require('./Routes/admin.routes');

// const seeder = require(path.join(__dirname, 'Routes', 'seeding.routes'));

const { userRoute } = require(path.join(__dirname, 'Routes', 'auth.routes'));

const { qrCode } = require(path.join(__dirname, 'Routes', 'qrcode.routes'));

const app = express();
app.use(
  cors({
    origin: '*',
  })
);

// Set headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  next();
});

app.use(express.json()).use(express.urlencoded({ extended: false }));

// app.use(seeder);

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.raw({ type: 'application/pdf', limit: '10mb' }));
app.use(bodyParser.json());

// const { superAdmin } = require('./seeder/admin');
// console.log(superAdmin())

app.use('/smp/qrcode', qrCode);
app.use('/smp/register', userRoute);
app.use('/smp/student/', studentRoute);
app.use('/smp/admin/', adminRoute);

app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('Status Healthy');
});

module.exports = {
  app,
};
