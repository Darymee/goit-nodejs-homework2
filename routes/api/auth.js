const express = require("express");
const authRouter = express.Router();

const {
  tryCatchWrapper,
  validationCheck,
  tokenValidation,
} = require("../../middlewares");

const {
  newUserCreateValidation,
  userLoginValidation,
  updateSubscriptionValidation,
} = require("../../schemas/user");

const {
  register,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
} = require("../../controllers/userControllers");

authRouter.post(
  "/signup",
  validationCheck(newUserCreateValidation),
  tryCatchWrapper(register)
);
authRouter.post(
  "/login",
  validationCheck(userLoginValidation),
  tryCatchWrapper(login)
);

authRouter.get(
  "/logout",
  tryCatchWrapper(tokenValidation),
  tryCatchWrapper(logout)
);

authRouter.get(
  "/current",
  tryCatchWrapper(tokenValidation),
  tryCatchWrapper(getCurrentUser)
);

authRouter.patch(
  "/",
  tryCatchWrapper(tokenValidation),
  validationCheck(updateSubscriptionValidation),
  tryCatchWrapper(updateSubscription)
);

module.exports = authRouter;
