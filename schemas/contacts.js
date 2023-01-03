const joi = require("joi");

const newContactValidation = joi.object({
  name: joi.string().min(3).required(),
  email: joi.string().min(6).required(),
  phone: joi.string().min(6).required(),
});

const updateContactValidation = joi.object({
  name: joi.string().min(3).required(),
  email: joi.string().min(6).required(),
  phone: joi.string().min(6).required(),
});

module.exports = {
  newContactValidation,
  updateContactValidation,
};
