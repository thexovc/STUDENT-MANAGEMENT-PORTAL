const {
  uploadPDF,
} = require('../Controllers/StudentController/fileUpload.controller');

const studentRoute = require('express').Router();

studentRoute.post('/upload', uploadPDF);

module.exports = {
  studentRoute,
};
