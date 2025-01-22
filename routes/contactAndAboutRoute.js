const express = require('express');
const contactRoute = express.Router();
const aboutRoute = express.Router();

contactRoute.get('/', (req, res) => {
  res.render('../views/pages/contact');
})

aboutRoute.get('/', (req, res) => {
  res.render('../views/pages/contact');
})

module.exports = { contactRoute, aboutRoute }