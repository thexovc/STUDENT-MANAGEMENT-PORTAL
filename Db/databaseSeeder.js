const path = require('path');

const fs = require('fs');

const csv = require('csv-parser');
const AppError = require('../Utils/appError');

const arr = [];

const { Student } = require(path.join(
  __dirname,
  '..',
  'Models',
  'Student.model',
));

const { tryCatch } = require(path.join(__dirname, '..', 'Utils', 'try_catch'));
const storingTheContentOfACsvFile = tryCatch(async (req, res) => {
  fs.createReadStream(path.join(__dirname, '..', '..', 'user_interest.csv'))
    .pipe(csv({}))
    .on('data', async (data) => arr.push(data))
    .on('end', async () => {
      arr.forEach(async (elem) => {
        Student.create({
          name: elem.Unnamed,
          category: elem.category_id,
        });
      });
    });
  res.status(200).json('done');
});

module.exports = { storingTheContentOfACsvFile };
