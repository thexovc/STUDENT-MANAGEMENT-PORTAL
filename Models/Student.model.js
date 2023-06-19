const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
  },
  matriculationNo: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  courses: [
    {
      type: String,
    },
  ],
  role: {
    type: String,
    enum: ['student'],
    default: 'student',
  },
  qrCode: {
    svgLink: String,
  },
});

const Student = mongoose.model('Student', studentSchema);

module.exports = {
  Student,
};
