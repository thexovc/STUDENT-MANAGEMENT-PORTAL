const { Student } = require('../../Models/Student.model');
const { tryCatch } = require('../../Utils/try_catch');

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

module.exports = {
  getSingleStudent,
};
