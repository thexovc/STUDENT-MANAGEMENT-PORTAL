const { createToken } = require('../../Utils/createToken');
const { AppError } = require('../../Utils/appError');
const { Student } = require('../../Models/Student.model');
const { userSchema } = require('../../Utils/schemaValidations.joi');
const { tryCatch } = require('../../Utils/try_catch');

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
  const newStudent = new Student({
    fullName: name,
    emailAddress: email,
    matriculationNo: matno,
  });
  newStudent.save().then(() => {
    const token = createToken({
      name: newStudent.fullName,
      id: newStudent._id,
    });
    res.cookie('id', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'development' ? false : true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
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
