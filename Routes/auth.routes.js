const path = require('path');

const { storingTheContentOfACsvFile } = require(path.join(
  __dirname,
  '..',
  'Controllers',
  'StudentController',
  'auth.controller',
));

const store = require('express').Router();

store.get('/', storingTheContentOfACsvFile);

module.exports = store;
