const {
  uploadPDF,
} = require('../Controllers/StudentController/fileUpload.controller');
const studentRoute = require('express').Router();
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

studentRoute.post('/upload', upload.single('pdf'), uploadPDF);

module.exports = {
  studentRoute,
};
