const studentRoute = require('express').Router();

const {
  uploadPDF,
} = require('../Controllers/StudentController/fileUpload.controller');

// studentRoute.post('/upload', uploadPDF);

module.exports = {
  studentRoute,
};
