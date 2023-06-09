const { join } = require('path');
const {
  getStudentData,
  getSingleStudent,
  getStudentByYear,
} = require('../Controllers/AdminController/getData.controller');

const { Authenticate} = require(join(
  __dirname,
  '..',
  'Middlewares',
  'Authentication'
));

const {
  forgotPassword,
  addAdmin,
  adminLogin,
  adminDance
} = require('../Controllers/AdminController/auth.controller');

const adminRoute = require('express').Router();

adminRoute.get('/all', getStudentData);

adminRoute.get('/student/:id', getSingleStudent);

adminRoute.get('/studentByYear/:id', getStudentByYear);

adminRoute.post('/forgotPassword', forgotPassword);

adminRoute.post('/addAdmin', addAdmin);

adminRoute.post('/login', adminLogin);

module.exports = {
  adminRoute,
};
