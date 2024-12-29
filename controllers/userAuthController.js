const pool = require("../db");
const bcrypt = require("bcrypt");

async function authenticatingUsers(req, res) {
  // Use user email to query for the hashed password,
  const { email, password } = req.body;
  let result = undefined;
  try {
    // Query the DB for email.
    result = await pool.query(
      `select 
          first_name, last_name, email, users.id, role, hashed_password 
        from 
          users, login_information 
        where 
          users.id=user_id and email ilike $1;`,
      [email]
    );
  } catch (err) {
    console.log(err);
    res.render("pages/sign_in_page", {
      error: "Backend Error. Call Admin (11111)",
    });
    return;
  }

  // if username & password is correct redirect to landing page.
  if (result && result.rowCount > 0) {
    bcrypt.compare(password, result.rows[0].hashed_password, (e, r) => {
      console.log(`user authentication: ${r}`);
      if (r) {
        req.session.regenerate(function (e) {
          if (e) {
            res.render("pages/sign_in_page", {
              error: "Backend Error. Call Admin (11101)",
            });
            console.log(e);
            return;
          } else {
            console.log("generating session");
            // store user information in session, typically a user id
            req.session.user = result.rows[0].id;
            req.session.role = result.rows[0].role;

            // save the session before redirection to ensure page
            // load does not happen before session is saved
            req.session.save((e) => {
              if (e) {
                res.render("pages/sign_in_page", {
                  error: "Backend Error. Call Admin (11100)",
                });
                console.log(e);
                return;
              } else {
                res.redirect("/");
              }
            });
          }
        });
      } else {
        // if username or password is wrong redirect to singin page with error.
        res.render("pages/sign_in_page", {
          error: "Invalid username and/or password!",
        });
      }
      if (e) {
        res.render("pages/sign_in_page", {
          error: "Backend Error. Call Admin (11110)",
        });
        console.log(e);
      }
    });
  } else {
    // if username or password is wrong redirect to singin page with error.
    res.render("pages/sign_in_page", {
      error: "Invalid username and/or password!",
    });
  }
}

module.exports = { authenticatingUsers };
