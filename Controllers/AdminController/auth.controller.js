const bcrypt = require('bcrypt');
const path = require('path');

const { createToken } = require('../../Utils/createToken');
const { AppError } = require('../../Utils/appError');
const { Admin } = require('../../Models/Admin.model');
const { tryCatch } = require('../../Utils/try_catch');
const { loginSchema } = require('../../Utils/schemaValidations.joi');
const { isAdmin } = require('../../Utils/isAdmin');
const { sendForgotPasswordEmail } = require('../../Utils/email');

const adminLogin = tryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  const found = await Admin.findOne({ emailAddress: email });
  const match = await bcrypt.compare(password, found.password);

  // remove password from the payload and send
  if (found && match) {
    const payload = { found };
    delete payload.password;
    return isAdmin(payload);
  }
  return next(new AppError('Invalid email or password', 404));
});

const addAdmin = tryCatch(async (req, res) => {
  if (req.Admin.role !== 'super admin') {
    return res
      .status(403)
      .json({ error: 'You are not authorized to perform this action' });
  }

  const newAdmin = await req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newAdmin.password, salt, (err, hash) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json({ message: err.message });
      }
      newAdmin.password = hash;

      // newAdmin.save();
    });
  });

  // console.log('newAdmin', newAdmin);
  const adminData = await Admin.create(newAdmin);

  res.send(adminData);
});

const forgotPassword = tryCatch(async (req, res, next) => {
  const { email } = await req.body;
  const password = Math.random().toString(36).substr(2, 8);
  const admin = await Admin.findOne({ email });

  if (!admin) {
    return next(new AppError('Admin does not exist', 404));
  }

  const { _id } = req.params;

  const newAdmin = new Admin({
    _id,
    fullName,
    emailAddress,
    password,
  });

  const filter = { email, _id: req.params.id };
  const options = { upsert: false };
  const updateDoc = {
    $set: {
      newAdmin,
    },
  };

  const result = await Admin.updateOne(filter, updateDoc, options);

  bcrypt.genSalt(10, (err, salt) => {
    console.log(newAdmin);
    bcrypt.hash(newAdmin.password, salt, (err, hash) => {
      if (err) {
        console.log(err.message);
        return res.status(500).json({ message: err.message });
      }
      newAdmin.password = hash;
      newAdmin.save();
    });
  });

  const emailSent = await sendForgotPasswordEmail({ email, password });

  if (!emailSent) {
    return next(new AppError('Forgot password email not sent', 404));
  }
});

const deleteAdmin = tryCatch(async (req, res) => {
  if (req.Admin.role !== 'super admin') {
    return res
      .status(403)
      .json({ error: 'You are not authorized to perform this action' });
  }

  try {
    const { email } = req.body;

    const adminToDelete = await Admin.findOne({ emailAddress: email }).exec();
    if (!adminToDelete) {
      return next(new AppError('Admin not found', 404));
    }

    if (adminToDelete.role === 'super admin') {
      return next(new AppError('Cannot delete super admin', 403));
    }

    await Admin.deleteOne({ emailAddress: email }).exec();
    res.status(200).json({ message: 'Admin added successfully.' });
  } catch (error) {
    return next(new AppError('Error deleting admin.', 400));
  }
});

// const adminLogin = (req, res, next) => {
//   const { email, password } = req.body;
//   const foundAdmin = Admin.findOne({ emailAddress: email }, { password: 0 });
//   const isUserFound = bcrypt.compare(password, foundAdmin.password);
//   if (foundAdmin && isUserFound) {
//     return isAdmin(foundAdmin);
//   }
//   next(new (AppError('You entered an invalid email or password', 404))());
// };

module.exports = {
  addAdmin,
  forgotPassword,
  adminLogin,
  deleteAdmin,
};
