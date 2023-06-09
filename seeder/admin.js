const bcrypt = require('bcrypt');
const path = require('path');

const { Admin } = require(path.join(__dirname, '..', 'Models', 'Admin.model'));
// const dotenv = require('dotenv').config();

exports.superAdmin = () => {
  const admin = Admin.findOne({ role: 'super admin' });
  if (admin) {
    return 'Super Admin account already exists';
  }

  const newAdmin = new Admin({
    fullName: 'Admin',
    emailAddress: 'superAdmin2023@gmail.com',
    role: 'super admin',
    password: 'Unibenadmin2023@',
  });

  bcrypt.genSalt(10, (err2, salt) => {
    console.log(newAdmin);
    if (err2) throw err2;
    bcrypt.hash(newAdmin.password, salt, (err3, hash) => {
      if (err3) throw err3;
      // set password to hashed
      newAdmin.password = hash;
      // save user
      newAdmin.save();
      return 'admin account created successfully';
    });
  });
};
