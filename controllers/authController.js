const router = require("express").Router();
const authService = require("../services/authService.js");
const { COOKIE_SESSION_NAME } = require("../config/constants.js");
const { isAuth, isGuest } = require("../middlewares/authMiddleware.js");
const { getErrorMessage } = require("../utils/errorHelpers.js");

router.get("/login", isGuest, (req, res) => {
  res.render("login");
});
router.post("/login", isGuest, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await authService.login(email, password);
    const token = await authService.createToken(user);

    res.cookie(COOKIE_SESSION_NAME, token, { httpOnly: true }); //setvame cookie-to s tokena na usera
    res.redirect("/");
  } catch (err) {
    return res.render("login", { error: getErrorMessage(err) });
  }
});

router.get("/register", isGuest, (req, res) => {
  res.render("register");
});
router.post("/register", isGuest, async (req, res) => {
  try {
    const { username, email, password, repeatPassword } = req.body;
    if (password !== repeatPassword) {
      return res.render("register", { error: "Password mismatch!" });
    }

    const createdUser = await authService.createUser(req.body);
    const token = await authService.createToken(createdUser);

    res.cookie(COOKIE_SESSION_NAME, token, { httpOnly: true });
    res.redirect("/");
  } catch (err) {
    return res.render("register", { error: getErrorMessage(err) });
  }
});

router.get("/logout", isAuth, (req, res) => {
  res.clearCookie(COOKIE_SESSION_NAME);
  res.redirect("/");
});

module.exports = router;
