const express = require("express");
const router = express.Router();
const homeController = require("./controllers/homeController.js");
const authController = require("./controllers/authController.js");
const cryptoController = require("./controllers/cryptoController.js");

router.use(homeController);
router.use("/auth", authController);
router.use("/crypto", cryptoController);

module.exports = router;
