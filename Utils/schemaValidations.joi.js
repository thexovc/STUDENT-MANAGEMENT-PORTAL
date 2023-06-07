const Joi = require('joi');

const adminRegistration = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Name field cannot be empty',
  }),
  email: Joi.string()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required()
    .messages({
      'string.pattern.base': 'Email is not a valid email address',
    }),
  password: Joi.string()
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
    )
    .required()
    .messages({
      'string.pattern.base':
        'Your password must contain at least one digit, one lowercase letter, one uppercase letter, and one special character. it should be at least 8 characters long',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().required().messages({
    'any.required': 'Email field cannot be empty',
  }),
  password: Joi.string()
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
    )
    .required()
    .messages({
      'string.pattern.base':
        'Your password must contain at least one digit, one lowercase letter, one uppercase letter, and one special character. it should be at least 8 characters long',
    }),
});

module.exports = {
  adminRegistration,
  loginSchema,
};
