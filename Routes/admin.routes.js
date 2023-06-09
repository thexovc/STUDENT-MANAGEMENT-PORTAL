const {
  getStudentData,
  getSingleStudent,
  getStudentByYear,
} = require('../Controllers/AdminController/getData.controller');

const { isAdmin } = require('../Utils/isAdmin');

const {
  forgotPassword,
  addAdmin,
  adminLogin,
  deleteAdmin,
} = require('../Controllers/AdminController/auth.controller');
const { Authenticate } = require('../Middlewares/Authentication');

const adminRoute = require('express').Router();

adminRoute.get('/all', getStudentData);

adminRoute.get('/student/:id', getSingleStudent);

adminRoute.get('/studentByYear/:id', getStudentByYear);

adminRoute.post('/forgotPassword', forgotPassword);

adminRoute.post('/addAdmin', addAdmin);

adminRoute.post('/login', adminLogin);

adminRoute.post('/delete', deleteAdmin);

module.exports = {
  adminRoute,
};
