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

});

const forgotPassword = tryCatch(async (req, res, next) => {
  const { email } = await req.body;
  const password = Math.random().toString(36).substr(2, 8);
  const admin = await Admin.findOne({ email });

  if (!admin) {
    return next(
      new AppError(
        'Admin does not exist',
        404
      )
    );
  }

  const { _id } = req.params;

  const newAdmin = new Admin({
    _id,
    fullName,
    email,
    password
  });

  const filter = { email, _id: req.params._id };
  const options = { upsert: false };
  const updateDoc = {
    $set: {
      newAdmin
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
    return next(
      new AppError(
        'Forgot password email not sent',
        404
      )
    );
  }
});

module.exports = {
  addAdmin,
  forgotPassword
};
