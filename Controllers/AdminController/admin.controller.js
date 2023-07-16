const { Student } = require('../../Models/Student.model');
const { Attendance } = require('../../Models/Attendance.model');
const { tryCatch } = require('../../Utils/try_catch');

const getStudentData = tryCatch(async (req, res) => {
  try {
    const pageNumber = req.params.page || 1;
    const pageSize = 6;
    const skip = (pageNumber - 1) * pageSize;
    const data = await Student.find({}).skip(skip).limit(pageSize);
    const totalCount = await Student.countDocuments();
    res.send({ data, totalCount });
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
});

const getStudentAllData = tryCatch(async (req, res) => {
  try {
    const studentDB = await Student.find({});
    if (studentDB) {
      res.send(studentDB);
    } else {
      res.send('No student found');
    }
  } catch (error) {
    console.log(error.message);
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
  const { courseCode, studentId } = req.body;

  try {
    // Find the student document by _id
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if the student has already registered the course code
    const existingAttendance = await Attendance.findOne({
      MatNo: student.matriculationNo,
      courseCode,
    });

    if (existingAttendance) {
      return res
        .status(400)
        .json({ error: 'Student already marked attendance for this course' });
    }

    // Create a new attendance record
    const attendance = new Attendance({
      fullName: student.fullName,
      emailAddress: student.emailAddress,
      MatNo: student.matriculationNo,
      attended: true,
      courseCode,
    });

    // Save the attendance record
    await attendance.save();

    return res
      .status(200)
      .json({ message: 'Attendance recorded successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const getAttendanceByCode = async (req, res) => {
  const { courseCode } = req.body;

  try {
    // Find all attendance records with the provided course code
    const attendance = await Attendance.find({ courseCode });

    return res.status(200).json(attendance);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getStudentData,
  getSingleStudent,
  getStudentByYear,
  updateAttendance,
  getAttendanceByCode,
  getStudentAllData,
};
