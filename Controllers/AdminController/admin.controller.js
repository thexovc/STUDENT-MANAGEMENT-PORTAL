const path = require('path');

const { Student } = require('../../Models/Student.model');
const { tryCatch } = require('../../Utils/try_catch');

const getStudentData = tryCatch(async (req, res, next) => {
  try {
    const data = await Student.find({});

    res.send(data);
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
});

const getSingleStudent = tryCatch(async (req, res, next) => {
  try {
    const matriculationNo = req.params.id;
    const studentDB = await Student.findOne({ matriculationNo });
    if (studentDB) {
      res.send(studentDB);
    } else {
      res.send('No student found');
    }
  } catch (error) {
    console.log(error.message);
  }
});

const getStudentByYear = tryCatch(async (req, res, next) => {
  try {
    const year = req.params.id;
    console.log(year);
    const studentDB = await Student.find({ year }).exec();
    if (studentDB) {
      res.send(studentDB);
    } else {
      res.send('No student found');
    }
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = {
  updateAttendance,
};

module.exports = {
  getStudentData,
  getSingleStudent,
  getStudentByYear,
};
