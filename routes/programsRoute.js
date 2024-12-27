const express = require("express");
const programs = express.Router();
const { isAdminRole } = require("../utils/authMiddleware");

programs.get("/", (req, res) => {
  if (isAdminRole(req)) console.log("user role:" + req.session.role);

  res.render("../views/pages/programs");
});

programs.get("/:id", (req, res) => {
  console.log("get parems: " + req.params.id);
  res.redirect("/");
});

programs.post("/create", isAdminRole, (req, res) => {
  console.log(req.body);
  res.redirect("/");
});

programs.post("/update", isAdminRole, (req, res) => {
  console.log(req.body);
  res.redirect("/");
});

programs.delete("/delete/:id", isAdminRole, (req, res) => {
  console.log("delete parems: " + req.params.id);
  res.redirect("/");
});

module.exports = programs;
