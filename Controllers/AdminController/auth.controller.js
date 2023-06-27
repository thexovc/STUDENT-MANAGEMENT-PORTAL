const bcrypt = require('bcrypt');

<<<<<<< HEAD
const { createToken } = require(path.join(
  __dirname,
  '..',
  '..',
  'Utils',
  'createToken'
));

const bcrypt = require('bcrypt');

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
=======
const { createToken } = require('../../Utils/createToken');
const { AppError } = require('../../Utils/appError');
const { Admin } = require('../../Models/Admin.model');
const { tryCatch } = require('../../Utils/try_catch');
const { loginSchema } = require('../../Utils/schemaValidations.joi');
const { sendForgotPasswordEmail } = require('../../Utils/email');
>>>>>>> db22cb089054b3594694d8a3a27f574df0cfc693

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

const adminLogin = tryCatch(async (req, res, next) => {
  const { email, password } = req.body;
  const found = await Admin.findOne({ emailAddress: email });

  if (!found) return next(new AppError('Invalid email or password', 404));
  const match = await bcrypt.compare(password, found.password);

  if (!match) return next(new AppError('Invalid email or password', 404));
  await delete found._doc['password'];
  const token = await createToken(found);
  res.cookie('id', `${token}`, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 2,
  });
  return res.status(200).json({
    success: true,
    message: 'Admin logged in successfully',
    data: token,
    user: found,
  });
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

module.exports = {
  addAdmin,
  forgotPassword,
  adminLogin,
  deleteAdmin,
};
