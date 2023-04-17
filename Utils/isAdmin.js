const isAdmin = (user) => {
  if (user.role === 'super admin' || user.role === 'admin') {
    res.status(200).json({
      status: 'success',
      message: 'Admin logged in successfully',
      data: {
        user,
      },
    });
    next(new (AppError('you are not authorized to visit this route', 403))());
  }
};

module.exports = {
  isAdmin,
};
