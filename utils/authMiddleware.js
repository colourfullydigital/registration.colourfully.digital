// middleware to test if user is Authenticated.
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  } else {
    return res.redirect("/sign_in");
  }
};

const isAdminRole = (req, res, next) => {
  if (req.session.user && req.session.role === "admin") {
    next();
  } else {
    console.log(res);
    return res.redirect("/");
  }
};

module.exports = { isAuthenticated, isAdminRole };
