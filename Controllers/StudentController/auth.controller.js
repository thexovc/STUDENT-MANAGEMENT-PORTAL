const { createToken } = require('../../Utils/createToken');
const { AppError } = require('../../Utils/appError');
const { Student } = require('../../Models/Student.model');
const { userSchema } = require('../../Utils/schemaValidations.joi');
const { tryCatch } = require('../../Utils/try_catch');

const studentLogin = async (req, res, next) => {
  const { name, matno } = req.body;

  try {
    const student = await Student.findOne({
      fullName: name,
      matriculationNo: matno,
    });

    if (!student) {
      throw new AppError('Invalid name or matriculation number', 404);
    }

    // If the student is found, you can perform additional login logic here if needed

    res.status(200).json({
      success: true,
      message: 'Student login successful',
      data: {
        student,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  studentLogin,
};
