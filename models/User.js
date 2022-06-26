const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { SALT_ROUNDS } = require("../config/env.js");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    minLength: [5, "Username is incorrect"],
  },
  email: {
    type: String,
    required: true,
    minlLength: [10, "Email must be at leat 10 characters"],
  },
  password: {
    type: String,
    required: true,
    minLength: [4, "Email or Password is incorrect"],
  },
});

userSchema.pre("save", function (next) {
  bcrypt.hash(this.password, SALT_ROUNDS).then((hashedPassword) => {
    this.password = hashedPassword;

    next();
  });
});

const User = mongoose.model("User", userSchema);
module.exports = User;
