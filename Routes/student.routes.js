const {
  uploadPDF,
} = require('../Controllers/StudentController/fileUpload.controller');
const {
  pdf,
} = require('../Controllers/StudentController/auth.controller');
const studentRoute = require('express').Router();
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

studentRoute.post('/upload', upload.single('pdf'), uploadPDF);
studentRoute.post('/sendpdf', pdf);

module.exports = {
  studentRoute,
};
