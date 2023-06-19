const path = require('path');

const {
  studentLogin,
} = require('../Controllers/StudentController/auth.controller');

const userRoute = require('express').Router();

userRoute.post('/', studentLogin);

module.exports = {
  userRoute,
};
