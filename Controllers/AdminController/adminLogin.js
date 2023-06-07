const { join } = require('path');

const { tryCatch } = require(join(__dirname, '..', '..', 'Utils', 'try_catch'));

const { Admin } = require(join(__dirname, '..', '..', 'Model', 'Admin.model'));

const { AppError } = require(join(__dirname, '..', '..', 'Utils', 'appError'));

const bcrypt = require('bcrypt');

const { loginSchema } = require(join(__dirname, '..', 'schemaValidations.joi'));

const adminLogin = tryCatch(async (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (!error) {
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
  }
  return next(new AppError(error, 422));
});

module.exports = {
  adminLogin,
};
