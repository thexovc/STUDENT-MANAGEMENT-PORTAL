const { createToken } = require('./createToken');

const isAdmin = (user) => {
  const token = createToken(user);

  if (user.found.role === 'super admin' || user.found.role === 'admin') {
    res.status(200).json({
      status: 'success',
      message: 'Admin logged in successfully',
      data: {
        user,
        token,
      },
    });
    next(new (AppError('you are not authorized to visit this route', 403))());
  }
};

module.exports = {
  isAdmin,
};
