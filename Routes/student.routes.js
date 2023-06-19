const {
  uploadPDF,
} = require('../Controllers/StudentController/fileUpload.controller');
const studentRoute = require('express').Router();
const multer = require('multer');
const {
  getSingleStudent,
} = require('../Controllers/StudentController/student.controller');

const upload = multer({ storage: multer.memoryStorage() });

studentRoute.post('/upload', upload.single('pdf'), uploadPDF);

studentRoute.get('/student/:id', getSingleStudent);

module.exports = {
  studentRoute,
};
