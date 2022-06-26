const { isAuth } = require("../middlewares/authMiddleware");
const cryptoService = require("../services/cryptoService.js");
const router = require("express").Router();
const Crypto = require("../models/Crypto.js");
const { getErrorMessage } = require("../utils/errorHelpers.js");
const mongoose = require("mongoose");

router.get("/catalog", async (req, res) => {
  const cryptoOffers = await cryptoService.getAll();
  res.render("catalog", { cryptoOffers });
});

router.get("/create", isAuth, (req, res) => {
  res.render("create");
});

router.post("/create", isAuth, async (req, res) => {
  const cryptoData = {
    ...req.body,
    owner: req.user._id,
  };
  try {
    await cryptoService.createCrypto(cryptoData);
    res.redirect("/crypto/catalog");
  } catch (err) {
    console.log("ERR>", err);
    res.render("create", { error: getErrorMessage(err) });
  }
});

router.get("/:cryptoId/details", async (req, res) => {
  const currentCrypto = await cryptoService.findByIdDetailed(
    req.params.cryptoId
  );
  const isAuthor = currentCrypto.owner._id == req.user?._id;
  const isBought = currentCrypto.buyCrypto.map(String).includes(req?.user?._id);

  res.render("details", {
    currentCrypto,
    isAuthor,
    isBought,
  });
});

router.get("/:cryptoId/edit", isAuth, async (req, res, next) => {
  const currentCrypto = await cryptoService
    .findById(req.params.cryptoId)
    .lean();
  console.log(currentCrypto);
  const cryptoWallet = currentCrypto.payment === "crypto-wallet";
  const debitCard = currentCrypto.payment === "debit-card";
  const payPal = currentCrypto.payment === "paypal";
  const creditCard = currentCrypto.payment === "credit-card";

  if (currentCrypto.owner != req.user._id) {
    return next({ message: "You are not authorized", status: 401 });
  }
  res.render("edit", {
    currentCrypto,
    cryptoWallet,
    debitCard,
    payPal,
    creditCard,
  });
});

router.post("/:cryptoId/edit", isAuth, async (req, res, next) => {
  const currentCrypto = await cryptoService.findById(req.params.cryptoId);

  if (currentCrypto.owner != req.user._id) {
    return next({ message: "You are not authorized", status: 401 });
  }
  try {
    await cryptoService.updateById(req.params.cryptoId, req.body);
    res.redirect(`/crypto/${req.params.cryptoId}/details`);
  } catch (err) {
    res.render("edit", {
      currentCrypto: req.body,
      error: getErrorMessage(err),
    });
  }
});

router.get("/:cryptoId/delete", isAuth, async (req, res, next) => {
  const currentCrypto = await cryptoService.findById(req.params.cryptoId);

  if (currentCrypto.owner != req.user._id) {
    return next({ message: "You are not authorized", status: 401 });
  }
  await cryptoService.deleteCrypto(req.params.cryptoId);
  res.redirect("/crypto/catalog");
});

router.get("/:cryptoId/buy", isAuth, async (req, res) => {
  const currentCrypto = await cryptoService.findById(req.params.cryptoId);
  currentCrypto.buyCrypto.push(req.user._id);
  await currentCrypto.save();
  res.redirect(`/crypto/${req.params.cryptoId}/details`);
});

router.get("/search", async (req, res) => {
  const cryptoOffers = await cryptoService.getAll();
  res.render("search", { cryptoOffers });
});

router.post("/search", async (req, res) => {
  const cryptoOffers = await cryptoService.getCryptoBySearch(
    req.body.text,
    req.body.payment
  );
  res.render("search", { cryptoOffers });
});

module.exports = router;
