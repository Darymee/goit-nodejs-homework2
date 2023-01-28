const jwt = require("jsonwebtoken");
const { User } = require("../models/users");

const multer = require("multer");
const path = require("path");
const Jimp = require("jimp");

function validationCheck(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return next();
  };
}

function tryCatchWrapper(endpointFn) {
  return async (req, res, next) => {
    try {
      await endpointFn(req, res, next);
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../tmp"));
  },
  filename: function (req, file, cb) {
    cb(null, req.user._id + file.originalname);
  },
});

const upload = multer({
  storage,
});

async function resizeAvatar(req, res, next) {
  const { path } = req.file;
  try {
    const avatar = await Jimp.read(path);
    const resizingAvatar = avatar.resize(250, 250);

    await resizingAvatar.writeAsync(path);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  next();
}

module.exports = {
  validationCheck,
  tryCatchWrapper,
  tokenValidation,
  upload,
  resizeAvatar,
};
