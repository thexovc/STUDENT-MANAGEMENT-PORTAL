const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().required().messages({
    'any.required': 'Email field cannot be empty',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password field cannot be empty',
  }),
  name: Joi.string().required().messages({
    'any.required': 'Name field cannot be empty',
  }),
  matno: Joi.string().required().messages({
    'any.required': 'Mat no field cannot be empty',
  }),
});

module.exports = {
  userSchema,
};
