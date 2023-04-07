const path = require('path');

const { Student } = require(path.join(
  __dirname,
  '..',
  '..',
  'Models',
  'Student.model'
));

const { tryCatch } = require(path.join(
  __dirname,
  '..',
  '..',
  'Utils',
  'try_catch'
));
