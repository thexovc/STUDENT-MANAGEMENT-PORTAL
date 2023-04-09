const path = require('path');

const { Student } = require(path.join(
  __dirname,
  '..',
  '..',
  'Models',
  'Student.model'
));

const getStudentData = async (req, res) => {
  try {
    const data = await Student.find({});

    res.send(data);
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
};

const getSingleStudent = async (req, res) => {
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
};

const getStudentByYear = async (req, res) => {
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
};

module.exports = {
  getStudentData,
  getSingleStudent,
  getStudentByYear,
};
