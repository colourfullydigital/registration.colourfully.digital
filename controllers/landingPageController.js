const pool = require("../db");

async function servingLanding(req, res) {
  if (req.session.user) {
    let result = undefined;
    try {
      result = await pool.query(
        `select first_name from users where id=${req.session.user};`
      );
    } catch {
      res.render("index");
    }
    if (result.rowCount > 0) {
      res.render("index", result.rows[0]);
    } else {
      res.render("index");
    }
  } else {
    res.render("index");
  }
}

module.exports = servingLanding;
