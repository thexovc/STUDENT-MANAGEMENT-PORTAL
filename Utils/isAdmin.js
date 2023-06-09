const { join } = require('path');
const { AppError } = require(join(__dirname, 'appError'));
const { createToken } = require(join(_dirname, 'createToken'));
// const isAdmin = (user) => {
//   if (user.role === 'super admin' || user.role === 'admin') {
//     res.status(200).json({
//       status: 'success',
//       message: 'Admin logged in successfully',
//       data: {
//         user,
//       },
//     });
//     next(new (AppError('you are not authorized to visit this route', 403))());
//   }
// };

const isAdmin = (user) => {
  async (req, res, next) => {
    if (user.role === 'super admin' || user.role == 'admin') {
      const token = await createToken(user._id);
      res.cookie('user', `${token}`, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 2,
      });
      return res.status(200).json({
        status: 'success',
        message: 'Admin logged in successfully',
        data: {
          user,
        },
      });
    }
    return next(
      new AppError('You are not authorized to visit this route', 403)
    );
  };
};

module.exports = {
  isAdmin,
};
