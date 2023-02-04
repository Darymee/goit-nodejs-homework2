const joi = require("joi");

const newUserCreateValidation = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

const userLoginValidation = joi.object({
  email: joi.string().required(),
  password: joi.string().required(),
});

const updateSubscriptionValidation = joi.object({
  subscription: joi.string().required(),
});

const userMailVerifyValidation = joi.object({
  email: joi.string().required(),
});

module.exports = {
  newUserCreateValidation,
  userLoginValidation,
  updateSubscriptionValidation,
  userMailVerifyValidation,
};
