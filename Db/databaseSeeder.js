const path = require('path');

const fs = require('fs');

const csv = require('fast-csv');

const options = { headers: true, trim: true };

const AppError = require(path.join(__dirname, '..', 'Utils', 'appError'));

const arr = [];

const { Student } = require(path.join(
  __dirname,
  '..',
  'Models',
  'Student.model'
));

// const { tryCatch } = require(path.join(__dirname, '..', 'Utils', 'try_catch'));
// const storingTheContentOfACsvFile = tryCatch(async (req, res) => {
//   fs.createReadStream(path.join(__dirname, '..', '..', 'user_interest.csv'))
//     .pipe(csv())
//     .on('data', async (data) => arr.push(data))
//     .on('end', async () => {
//       arr.forEach(async (elem) => {
//         Student.create({
//           name: elem.name,
//           matriculationNo: elem.matno,
//         });
//       });
//     });
//   res.status(200).json('done');
// });

const { tryCatch } = require(path.join(__dirname, '..', 'Utils', 'try_catch'));
const storingTheContentOfACsvFile = tryCatch(async (req, res, next) => {
  fs.createReadStream(path.join(__dirname, '..', '..', 'user_interest.csv'))
    .pipe(csv.parse(options))
    .on('error', () => {
      next(new AppError('an error occurred while parsing the .csv file', 500));
    })
    .on('data', async (data) => arr.push(data))
    .on('end', async () => {
      arr.forEach(async (elem) => {
        Student.create({
          fullName: elem.user_id,
          matriculationNo: elem.category_id,
        });
      });
    });
  res.status(200).json('done');
});

module.exports = { storingTheContentOfACsvFile };
