const path = require('path');

const { AppError } = require(path.join(
  __dirname,
  '..',
  '..',
  'Utils',
  'appError'
));

const { Student } = require(path.join(
  __dirname,
  '..',
  '..',
  'Models',
  'Student.model'
));

const { userSchema } = require(path.join(
  __dirname,
  '..',
  '..',
  'Utils',
  'schemaValidations.joi'
));

const { tryCatch } = require(path.join(
  __dirname,
  '..',
  '..',
  'Utils',
  'try_catch'
));

const openAccount = tryCatch(async (req, res, next) => {
  const { email, name, matno } = req.body;

  const { error } = await userSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return next(new AppError(`${error}`, 422));
  }
  const found = await Student.findOne({
    fullName: name,
    matriculationNo: matno,
  });
  if (!found) {
    return next(
      new AppError(
        'you entered an invalid name or matriculation number, please check and try again',
        404
      )
    );
  }
  Student.create({
    fullName: name,
    emailAddress: email,
    matriculationNo: matno,
  }).then(() => {
    res.status(201).json({
      status: 'success',
      message: 'student successfully added',
      data: {
        name,
        matno,
      },
    });
  });
});

module.exports = {
  openAccount,
};
