const path = require('path');

const { storingTheContentOfAnCsvFile } = require(path.join(
  __dirname,
  '..',
  'Db',
  'databaseSeeder.js',
));

const seeder = require('express').Router();

seeder.get('/', storingTheContentOfAnCsvFile);

module.exports = seeder;
