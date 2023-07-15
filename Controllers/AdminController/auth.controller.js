const bcrypt = require('bcrypt');

const { createToken } = require('../../Utils/createToken');
const { AppError } = require('../../Utils/appError');
const { Admin } = require('../../Models/Admin.model');
const { tryCatch } = require('../../Utils/try_catch');
const { loginSchema } = require('../../Utils/schemaValidations.joi');
const { sendForgotPasswordEmail } = require('../../Utils/email');
const { generateRandomPassword } = require('../../Utils/helper');

const addAdminFM = tryCatch(async (req, res) => {
  if (req.Admin.role !== 'super admin') {
    return res
      .status(403)
      .json({ error: 'You are not authorized to perform this action' });
  }
  const newAdmin = await new Admin(req.body);

  bcrypt.genSalt(10, (err, salt) => {
    // console.log(newAdmin);
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

const addAdmin = async (req, res) => {
  const { fullName, emailAddress } = req.body;

  try {
    if (req.Admin.role !== 'super admin') {
      return res.status(403).json({ error: 'Only super admin can add admin' });
    }

    // Generate a random password for the admin
    const generatedPassword = generateRandomPassword();

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // Create the new admin document
    const newAdmin = new Admin({
      fullName,
      emailAddress,
      password: hashedPassword,
      role: 'admin',
    });

    // Save the new admin to the database
    await newAdmin.save();

    // Send an email with the generated password to the admin
    const emailContent = {
      from: 'nacos-smp@example.com',
      to: emailAddress,
      subject: 'Welcome to the Admin Panel',
      text: `Hello ${fullName},\n\nYou have been added as an admin with the following credentials:\nEmail: ${emailAddress}\nPassword: ${generatedPassword}`,
    };

    emailService.send(emailContent, (err, message) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to send email' });
      }

      return res.status(200).json({ message: 'Admin added successfully' });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

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
    // console.log(newAdmin);
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
