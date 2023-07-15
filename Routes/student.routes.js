const {
  uploadPDF,
  sendEmail,
} = require('../Controllers/StudentController/fileUpload.controller');
const { pdf } = require('../Controllers/StudentController/auth.controller');
const studentRoute = require('express').Router();
const multer = require('multer');
const {
  getSingleStudent,
} = require('../Controllers/StudentController/student.controller');

const upload = multer({ storage: multer.memoryStorage() });

studentRoute.post('/upload', upload.single('pdf'), uploadPDF);
studentRoute.post('/sendpdf', pdf);

studentRoute.get('/student/:id', getSingleStudent);

studentRoute.post('/sendEmail', sendEmail);

module.exports = {
  studentRoute,
};
