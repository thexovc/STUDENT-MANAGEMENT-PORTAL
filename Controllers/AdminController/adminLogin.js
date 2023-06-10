const bcrypt = require('bcrypt');

const { tryCatch } = require('../../Utils/try_catch');
const { AppError } = require('../../Utils/appError');
const { loginSchema } = require('../../Utils/schemaValidations.joi');
const { Admin } = require('../../Models/Admin.model');

const adminLogin = tryCatch(async (req, res, next) => {
  // const { error } = loginSchema.validate(req.body);

  const { email, password } = req.body;
  const found = await Admin.findOne({ emailAddress: email });
  const match = await bcrypt.compare(password, found.password);
  // remove password from the payload and send
  if (found && match) {
    const payload = { ...found };
    delete payload.password;
    return res.status(200).json({
      success: true,
      message: 'You have successfully logged in',
      data: payload,
    });
  }
  return next(new AppError('Invalid email or password', 404));

  // return next(new AppError(error, 422));
});

module.exports = {
  adminLogin,
};
