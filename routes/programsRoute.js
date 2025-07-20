const express = require("express");
const programs = express.Router();
const { isAdminRole } = require("../utils/authMiddleware");
const { getPrograms, getProgram, updateProgram, createProgram } = require("../controllers/programsController");

// programs.use(express.json());

programs.get("/", (req, res) => {
  getPrograms(req, res);
});

programs.get("/:id", (req, res) => {
  console.log("Request reached. ")
  getProgram(req, res);
});

programs.post("/create", isAdminRole, (req, res) => {
  console.log("======================creating program==============");
  console.log(req.body);

  createProgram(req, res);

});

programs.post("/update", isAdminRole, (req, res) => {
  console.log("=========================updating program===========");
  console.log("-------------------------body-----------------------");
  console.log(req.body);
  console.log("----------------------------------------------------");

  updateProgram(req, res);

  // res.redirect("/");
});

programs.post("/delete", isAdminRole, (req, res) => {
  console.log("delete parems: ", req.body);
  res.redirect("/programs");
});

module.exports = programs;
