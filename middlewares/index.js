const jwt = require("jsonwebtoken");
const { User } = require("../models/users");

function validationCheck(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return next();
  };
}

function tryCatchWrapper(enpointFn) {
  return async (req, res, next) => {
    try {
      await enpointFn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

async function tokenValidation(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer") {
    return res.status(401).json({ message: "Not authorized" });
  }
  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }
  }

  next();
}

module.exports = {
  validationCheck,
  tryCatchWrapper,
  tokenValidation,
};
