const bcrypt = require('bcrypt');
const path = require('path');

const { createToken } = require(path.join(
  __dirname,
  '..',
  '..',
  'Utils',
  'createToken'
));

const { AppError } = require(path.join(
  __dirname,
  '..',
  '..',
  'Utils',
  'appError'
));

const { Admin } = require(path.join(
  __dirname,
  '..',
  '..',
  'Models',
  'Admin.model'
));

const { tryCatch } = require(path.join(
  __dirname,
  '..',
  '..',
  'Utils',
  'try_catch'
));

const { sendForgotPasswordEmail } = require(path.join(
  __dirname,
  '..',
  '..',
  'Utils',
  'email'
));

const addAdmin = tryCatch(async (req, res) => {
  if (req.Admin.role !== 'super admin') {
    return res
      .status(403)
      .json({ error: 'You are not authorized to perform this action' });
  }
  const newAdmin = await req.body;

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

const adminLogin = (req, res, next) => {
  const { email, password } = req.body;
  const foundAdmin = Admin.findOne({ emailAddress: email }, { password: 0 });
  if (foundAdmin) {
    const isUserFound = bcrypt.compare(password, foundAdmin.password);
    if (!isUserFound) {
      next(new (AppError('You entered an invalid email or password', 404))());
      res.status(200).json({
        status: 'success',
        message: 'Admin logged in successfully',
        data: {
          foundAdmin,
        },
      });
    }
  }
};

module.exports = {
  addAdmin,
  forgotPassword,
  adminLogin,
};
