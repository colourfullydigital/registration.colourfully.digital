const express = require("express");
const dependents = express.Router();
const { isAuthenticated } = require("../utils/authMiddleware");
const {
  getDependents,
  getDependent,
  updateDependent,
  createDependent,
  deleteDependent,
} = require("../controllers/dependentsController");

dependents.get("/", isAuthenticated, (req, res) => {
  getDependents(req, res);
});

dependents.get("/edit/:id", isAuthenticated, (req, res) => {
  getDependent(req, res);
});

dependents.post("/update/:id", isAuthenticated, (req, res) => {
  updateDependent(req, res);
});

dependents.post("/create", isAuthenticated, (req, res) => {
  createDependent(req, res);
});

dependents.post("/delete/", isAuthenticated, (req, res) => {
  deleteDependent(req, res);
});
module.exports = dependents;
