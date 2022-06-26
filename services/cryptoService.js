const Crypto = require("../models/Crypto.js");

exports.createCrypto = (cryptoData) => {
  return Crypto.create(cryptoData);
};

exports.getAll = async () => {
  const cryptoOffers = await Crypto.find({}).lean();
  return cryptoOffers;
};

exports.findById = (cryptoId) => {
  return Crypto.findById(cryptoId);
};

exports.findByIdDetailed = (cryptoId) => {
  return Crypto.findById(cryptoId).populate("owner").lean();
};

exports.updateById = (cryptoId, updatedData) => {
  return Crypto.findByIdAndUpdate(cryptoId, updatedData, {
    runValidators: true,
  }).lean();
};

exports.deleteCrypto = (cryptoId) => {
  return Crypto.findByIdAndDelete(cryptoId);
};

exports.getCryptoBySearch = async (text, payment) => {
  const allCrypto = await Crypto.find({}).lean();
  const resultCrypto = allCrypto
    .filter((x) => x.name.includes(text))
    .filter((x) => x.payment.toLowerCase().split(" ").join("-") === payment);
  return resultCrypto;
};
