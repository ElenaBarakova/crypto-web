const mongoose = require("mongoose");

const cryptoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minLength: [2, "Name must be at least 10 character long!"],
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minLength: [10, "Description must be at least 10 character long!"],
  },
  payment: {
    type: String,
    enum: ["crypto-wallet", "credit-card", "debit-card", "paypal"],
    required: true,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  buyCrypto: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Crypto = mongoose.model("Crypto", cryptoSchema);
module.exports = Crypto;
