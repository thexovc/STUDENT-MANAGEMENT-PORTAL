const {
  getStudentData,
  getSingleStudent,
  getStudentByYear,
} = require('../Controllers/AdminController/admin.controller');

const {
  forgotPassword,
  addAdmin,
  deleteAdmin,
  adminLogin,
} = require('../Controllers/AdminController/auth.controller');
const { isAdmin } = require('../Middlewares/isAdmin');
const {
  updateAttendance,
} = require('../Controllers/AdminController/admin.controller');

const adminRoute = require('express').Router();

adminRoute.post('/login', adminLogin);
adminRoute.post('/forgotPassword', forgotPassword);

adminRoute.get('/all/:page', isAdmin, getStudentData);

adminRoute.get('/student/:id', isAdmin, getSingleStudent);

adminRoute.get('/studentByYear/:id', isAdmin, getStudentByYear);

adminRoute.post('/addAdmin', isAdmin, addAdmin);

adminRoute.post('/delete', isAdmin, deleteAdmin);

module.exports = {
  adminRoute,
};
