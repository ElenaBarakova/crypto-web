const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../config/env.js");

exports.createUser = (userData) => User.create(userData);
exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw {
      message: "Email or Password is incorrect!",
    };
  }
  const isValid = bcrypt.compare(password, user.password);
  if (!isValid) {
    throw {
      message: "Email or Password is incorrect!",
    };
  }
  return user;
};

exports.createToken = (user) => {
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };

  const options = { expiresIn: "2d" };
  const tokenPromise = new Promise((resolve, reject) => {
    jwt.sign(payload, SECRET, options, (err, decodedToken) => {
      if (err) {
        return reject(err);
      }
      resolve(decodedToken);
    });
  });
  return tokenPromise;
};
