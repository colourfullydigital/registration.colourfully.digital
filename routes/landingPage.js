const express = require("express");
const servingLanding = require("../controllers/landingPageController");
const landing = express.Router();

landing.get("/", async (req, res) => {
  servingLanding(req, res);
});

module.exports = landing;
