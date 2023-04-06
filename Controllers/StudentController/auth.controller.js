const path = require('path');

const fs = require('fs');

const arr = [];

const { User } = require(path.join(
  __dirname,
  '..',
  '..',
  'Models',
  'Stusent.model'
));

const { tryCatch } = require(path.join(
  __dirname,
  '..',
  '..',
  'Utils',
  'try_catch'
));
const storingTheContentOfACsvFile = tryCatch(async (req, res, next) => {
  //   User.create({
  //   });
});

// console.log(storingTheContentOfACsvFile);

// module.exports = { storingTheContentOfACsvFile };
fs.createReadStream(path.join(__dirname, '..', '..', 'user_interest.csv'))
  .pipe(csv({}))
  .on('data', (data) => {
    arr.push(data).on('end', () => {
      console.log(arr);
    });
  });
console.log('hi');
