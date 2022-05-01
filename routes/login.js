const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/User");

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    //res.render("login", { error: "User does not exist" });
    return res.send("User does not exist");
  } else {
    const match = password == user.password ? true : false;
    if (match) {
      req.session.user = user;
      //return res.redirect("/");
      return res.redirect('/index');
    } else {
      res.send("<h1>Wrong password</h1>");
      //res.render("login", { error: "Wrong password" });
    }
  }
});
router.get("/logout", (req, res) => {
  if (res.session) {
    req.session.destroy();
    if (err) {
      return res.send(err);
    } else {
      return res.send("OK");
    }
  }
});
router.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/index');
  }
  return res.render('login', { error: null });
})
module.exports = router;
