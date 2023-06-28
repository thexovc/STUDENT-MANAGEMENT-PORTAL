const { Student } = require('../../Models/Student.model');
const { Attendance } = require('../../Models/Attendance.model');
const { tryCatch } = require('../../Utils/try_catch');

const getStudentData = tryCatch(async (req, res) => {
  try {
    const data = await Student.find({});

    res.send(data);
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
});

const getSingleStudent = tryCatch(async (req, res) => {
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

const getStudentByYear = tryCatch(async (req, res) => {
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

const updateAttendance = tryCatch(async (req, res) => {
  try {
    const courseCode = req.body.course;
    const matriculationNo = req.body.matno;
    const studentDB = await Student.findOne({ matriculationNo });
    if (studentDB) {
      const newAttendance = new Attendance({
        fullName: studentDB.fullName,
        emailAddress: studentDB.emailAddress,
        MatNo: matriculationNo,
        courseCode: req.body.course,
      });
      const { courses } = studentDB;
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].code === courseCode) {
          const attendanceDB = await Attendance.findOne({
            courseCode: req.body.course,
            MatNo: matriculationNo,
          });
          if (attendanceDB) {
            res.send('Attendance has been taken');
          } else {
            newAttendance.attended = true;
            newAttendance.save();
            res.send('Attendance taken');
          }
        } else {
          res.send('Student doesn;t take this course');
        }
      }
    } else {
      res.send('No student found');
    }
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = {
  getStudentData,
  getSingleStudent,
  getStudentByYear,
  updateAttendance,
};
