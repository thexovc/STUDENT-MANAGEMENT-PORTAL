const { createToken } = require('../../Utils/createToken');
const { AppError } = require('../../Utils/appError');
const { Student } = require('../../Models/Student.model');
const { userSchema } = require('../../Utils/schemaValidations.joi');
const { tryCatch } = require('../../Utils/try_catch');

const studentLogin = async (req, res, next) => {
  const { email, matno } = req.body;

  console.log(req.body);

  try {
    const student = await Student.findOne({
      emailAddress: email,
    });

    if (!student) {
      throw new AppError('Invalid name or matriculation number', 400);
    }

    // If the student is found, you can perform additional login logic here if needed

    res.send(student);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  studentLogin,
};
