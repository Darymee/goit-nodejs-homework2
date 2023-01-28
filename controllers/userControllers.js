const { User } = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");

const path = require("path");
const fs = require("fs/promises");

async function register(req, res, next) {
  const { email, password } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const avatarURL = gravatar.url(email, { protocol: "https" });

  try {
    const newUser = await User.create({
      email,
      password: hashedPassword,
      avatarURL,
    });

    return res.status(201).json({
      user: {
        email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error")) {
      return res.status(409).json({ message: "Email in use" });
    }
    throw error;
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  const userToFind = await User.findOne({ email });

  if (!userToFind) {
    return res.status(401).json({
      message: "Email or password is wrong",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, userToFind.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Email or password is wrong",
    });
  }

  const payload = { id: userToFind._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return res.status(200).json({
    token,
    user: {
      email,
      subscription: userToFind.subscription,
    },
  });
}

async function logout(req, res, next) {
  try {
    const { _id } = req.user;
    const user = await User.findByIdAndUpdate(_id, { token: null });

    if (!user) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }
    res.status(204).json();
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

async function getCurrentUser(req, res, next) {
  const { user } = req;
  const { email, subscription } = user;

  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  return res.status(200).json({
    user: {
      email,
      subscription,
    },
  });
}

async function updateSubscription(req, res, next) {
  const body = req.body;
  const { email, _id } = req.user;

  const types = ["starter", "pro", "business"];

  for (const type of types) {
    if (body.subscription === type) {
      try {
        const newSubscription = await User.findByIdAndUpdate(_id, body, {
          new: true,
        });

        if (!newSubscription) {
          return res.status(404).json({ message: "Not found" });
        }

        return res.status(200).json({
          user: {
            email,
            subscription: newSubscription.subscription,
          },
        });
      } catch (error) {
        return res.status(404).json({ message: error.message });
      }
    }
  }
  return res.status(404).json({ message: "Invalid type of subscription" });
}

async function updateAvatar(req, res, next) {
  const { filename } = req.file;
  const tmpPath = path.resolve(__dirname, "../tmp", filename);
  const publicPath = path.resolve(__dirname, "../public/avatars", filename);

  try {
    await fs.rename(tmpPath, publicPath);

    const userId = req.user._id;

    const avatarURL = `/avatars/${filename}`;

    const updateAvatar = await User.findByIdAndUpdate(
      userId,
      { avatarURL },
      { new: true }
    );
    return res.status(200).json({ avatarURL: updateAvatar.avatarURL });
  } catch {
    await fs.unlink(tmpPath);
    return res.status(401).json({ message: "Not authorized" });
  }
}

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
};
