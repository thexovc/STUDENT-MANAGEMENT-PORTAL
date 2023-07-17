const adminRoute = require('express').Router();
const {
  getStudentData,
  getSingleStudent,
  getStudentByYear,
  updateAttendance,
  getAttendanceByCode,
  getStudentAllData,
  allAdmins,
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

adminRoute.get('/studentAll', isAdmin, getStudentAllData);

adminRoute.get('/student/:id', isAdmin, getSingleStudent);

adminRoute.get('/studentByYear/:id', isAdmin, getStudentByYear);

adminRoute.post('/addAdmin', isAdmin, addAdmin);

adminRoute.post('/allAdmin', allAdmins);

adminRoute.post('/delete', isAdmin, deleteAdmin);

adminRoute.post('/attendance', isAdmin, updateAttendance);

adminRoute.post('/getAttendanceByCode', isAdmin, getAttendanceByCode);

module.exports = {
  adminRoute,
};
