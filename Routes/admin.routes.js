const {
  getStudentData,
  getSingleStudent,
  getStudentByYear,
} = require('../Controllers/AdminController/getData.controller');

const {
  forgotPassword,
  addAdmin
} = require('../Controllers/AdminController/auth.controller');

const adminRoute = require ('express').Router();

adminRoute.get('/all', getStudentData);

adminRoute.get('/student/:id', getSingleStudent);

adminRoute.get('/studentByYear/:id', getStudentByYear);

adminRoute.post('/forgotPassword', forgotPassword);

adminRoute.post('/addAdmin', addAdmin);

module.exports = {
  adminRoute,
};
