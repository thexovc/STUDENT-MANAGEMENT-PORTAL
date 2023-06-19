const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    default: '',
  },
  MatNo: {
    type: String,
    required: true,
  },
  courseCode: {
    type: String,
    required: true,
  },
  attended: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = {
  Attendance,
};
