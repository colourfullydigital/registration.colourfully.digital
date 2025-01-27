const express = require("express");
const programs = express.Router();
const { isAdminRole } = require("../utils/authMiddleware");
const { getPrograms } = require("../controllers/programsController");

programs.get("/", (req, res) => {
  getPrograms(req, res);
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
