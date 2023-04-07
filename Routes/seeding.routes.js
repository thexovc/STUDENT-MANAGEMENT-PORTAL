const path = require('path');

const { storingTheContentOfACsvFile } = require(path.join(
  __dirname,
  '..',
  'Db',
  'databaseSeeder.js',
));

const seeder = require('express').Router();

seeder.get('/', storingTheContentOfACsvFile);

module.exports = seeder;
