const Joi = require('joi');

const validator = {};



validator.login = {
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  })
};

module.exports = validator;
