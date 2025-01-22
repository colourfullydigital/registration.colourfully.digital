const pool = require("../db");

async function servingLanding(req, res) {
  if (req.session.user) {
    let result = undefined;
    try {
      result = await pool.query(
        `select first_name from users where id=${req.session.user};`
      );
    } catch {
      console.log("Backend error: 82384729");
    }
    if (result.rowCount > 0) {
      res.render("pages/index", result.rows[0]);
    } else {
      res.render("pages/index");
    }
  } else {
    res.render("pages/index");
  }
}

module.exports = servingLanding;
