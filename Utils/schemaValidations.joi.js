const joi = require('joi');

const userSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().lowercase().required(),
  matno: joi.string().required(),
});

module.exports = {
  userSchema,
};
