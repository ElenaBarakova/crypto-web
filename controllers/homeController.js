const router = require("express").Router();
const cryptoService = require("../services/cryptoService.js");

router.get("/", async (req, res) => {
  const cryprosResult = await cryptoService.getAll();
  res.render("home", { cryprosResult });
});

module.exports = router;
