const express = require("express");
const creatingNewUser = require("../controllers/accountController");
const accountRoute = express.Router();

// sign up
accountRoute.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.render("pages/sign_up_page");
  }
});

// Post sign up
accountRoute.post("/", (req, res) => {
  creatingNewUser(req, res);
});

module.exports = accountRoute;
