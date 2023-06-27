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
  },
  session: {
    type: String,
  },
  courses: [
    {
      code: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      credit: {
        type: String,
        required: true,
      },
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
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const Student = mongoose.model('Student', studentSchema);

module.exports = {
  Student,
};
