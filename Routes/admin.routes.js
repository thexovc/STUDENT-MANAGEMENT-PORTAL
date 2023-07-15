const adminRoute = require('express').Router();
const {
  getStudentData,
  getSingleStudent,
  getStudentByYear,
  updateAttendance,
  getAttendanceByCode,
} = require('../Controllers/AdminController/admin.controller');

const {
  forgotPassword,
  addAdmin,
  deleteAdmin,
  adminLogin,
} = require('../Controllers/AdminController/auth.controller');
const { isAdmin } = require('../Middlewares/isAdmin');

adminRoute.post('/login', adminLogin);
adminRoute.post('/forgotPassword', forgotPassword);

adminRoute.get('/all/:page', isAdmin, getStudentData);

adminRoute.get('/student/:id', isAdmin, getSingleStudent);

adminRoute.get('/studentByYear/:id', isAdmin, getStudentByYear);

adminRoute.post('/addAdmin', isAdmin, addAdmin);

adminRoute.post('/delete', isAdmin, deleteAdmin);

adminRoute.post('/attendance', updateAttendance);

adminRoute.post('/getAttendanceByCode', getAttendanceByCode);

module.exports = {
  adminRoute,
};
