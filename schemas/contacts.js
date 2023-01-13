const joi = require("joi");

const newContactValidation = joi.object({
  name: joi.string().min(3).required(),
  email: joi.string().min(6).required(),
  phone: joi.string().min(6).required(),
  favorite: joi.boolean(),
});

const updateContactValidation = joi.object({
  name: joi.string().min(3).required(),
  email: joi.string().min(6).required(),
  phone: joi.string().min(6).required(),
  favorite: joi.boolean().required(),
});

const updateStatusContactValidation = joi.object({
  favorite: joi.boolean().required(),
});

module.exports = {
  newContactValidation,
  updateContactValidation,
  updateStatusContactValidation,
};
