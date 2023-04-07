const tryCatch = (func) => {
  return async (req, res, next) => {
    await func(req, res).catch((err) => {
      next(err);
    });
  };
};

module.exports = {
  tryCatch,
};
