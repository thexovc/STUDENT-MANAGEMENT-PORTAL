const path = require('path');

const fs = require('fs');

const csv = require('csv-parser');

const arr = [];

const { Student } = require(path.join(
    __dirname,
    '..',
    'Models',
    'Student.model',
  ));
  
  const { tryCatch } = require(path.join(
    __dirname,
    '..',
    'Utils',
    'try_catch',
  ));
  const storingTheContentOfACsvFile = tryCatch(async (req, res, next) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'user_interest.csv'))
      .pipe(csv({}))
      .on('data', (data) => arr.push(data))
      .on('end', () => {
        arr.forEach(async (elem) => {
          const stu = new Student({
            name: elem.Unnamed,
            category: elem.category_id,
          });
          await stu.save();
          res.status(200).json('done');
        });
      });
  });
  
  module.exports = { storingTheContentOfACsvFile };
