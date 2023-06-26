const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['super admin', 'admin'],
    default: 'admin',
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = {
  Admin,
};
