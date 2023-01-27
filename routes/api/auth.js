const express = require("express");
const authRouter = express.Router();

const {
  tryCatchWrapper,
  validationCheck,
  tokenValidation,
  upload,
  resizeAvatar,
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
  updateAvatar,
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

authRouter.patch(
  "/avatars",
  tryCatchWrapper(tokenValidation),
  upload.single("avatar"),
  tryCatchWrapper(resizeAvatar),
  tryCatchWrapper(updateAvatar)
);

module.exports = authRouter;
