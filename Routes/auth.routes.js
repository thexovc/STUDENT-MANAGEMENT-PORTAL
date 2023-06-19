const path = require('path');

const {
  openAccount,
} = require('../Controllers/StudentController/auth.controller');

const userRoute = require('express').Router();

userRoute.post('/', openAccount);

module.exports = {
  userRoute,
};
