const { createToken } = require('../../Utils/createToken');
const { AppError } = require('../../Utils/appError');
const { Student } = require('../../Models/Student.model');
const { userSchema } = require('../../Utils/schemaValidations.joi');
const { tryCatch } = require('../../Utils/try_catch');
const { sendPDFEmail } = require('../../Utils/email');

const openAccount = tryCatch(async (req, res, next) => {
  const { email, name, matno, password } = req.body;

  const { error } = await userSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) return next(new AppError(`${error}`, 422));
  const found = await Student.findOne({
    fullName: name,
    matriculationNo: matno,
  });
  if (!found) {
    return next(
      new AppError('You entered an invalid name or matriculation number', 404)
    );
  }
  const hash = await bcrypt.hash(password, process.env.ROUNDS);
  const newStudent = new Student({
    fullName: name,
    emailAddress: email,
    matriculationNo: matno,
    password: hash,
  });
  newStudent.save().then(() => {
    const token = createToken({
      id: newStudent._id,
    });
    res.cookie('id', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'development' ? false : true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      success: true,
      message: 'Student successfully added',
      data: {
        name,
        matno,
      },
    });
  });
});

const pdf = tryCatch(async (req, res, next) => {
  const { email } = await req.body;

  const emailSent = await sendPDFEmail({ email });

  if (!emailSent) {
    return next(new AppError('Forgot password email not sent', 404));
  }
});

module.exports = {
  openAccount,
  pdf
};
