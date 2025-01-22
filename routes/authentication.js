const express = require("express");
const auth = express.Router();
const logOut = express.Router();
const { isAuthenticated } = require("../utils/authMiddleware");
const { authenticatingUsers } = require("../controllers/userAuthController");

// sign in
auth.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.render("../views/pages/sign_in_page");
  }
});

auth.post("/", async (req, res) => {
  authenticatingUsers(req, res);
});

// sign out
logOut.get("/", isAuthenticated, function (req, res) {
  // logout logic

  // clear the user from the session object and save.
  // this will ensure that re-using the old session id
  // does not have a logged in user
  req.session.user = null;
  req.session.role = null;
  req.session.save((e) => {
    if (e) {
      res.render("index", {
        error: "Backend Error. Call Admin (10101)",
      });
      console.log(e);
      return;
    }

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (e) {
      if (e) {
        console.log(e);
        res.redirect("/");
        return;
      }
      res.redirect('/')
    });
  });
});

module.exports = { auth, logOut };
