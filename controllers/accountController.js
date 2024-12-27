const pool = require("../db");
const bcrypt = require("bcrypt");
const ev = require("email-validator");

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function isPhoneNumber(phone) {
  const phoneRegex =
    /^(?:\+?(\d{1,3}))?[\s\.\-\(\)]*([\d]{1,4})[\s\.\-\(\)]*([\d]{1,4})[\s\.\-\(\)]*([\d]{1,4})$/;
  return phoneRegex.test(phone);
}

function creatingNewUser(req, res) {
  console.log(req.body);
  const f = req.body;
  let fb = { warning: "" };
  // check that both first and last name were filled.
  if (f.f_name === "" && f.l_name == "") {
    fb.warning += "\n Please Input a first and last name. ";
  }
  // check that email was filled.
  // check that email is the correct format.
  if (f.email === "") {
    f.warning += "\n Please input an email.";
  }
  if (isValidEmail(f.email) && !ev.validate(f.email)) {
    fb.warning += "\n Your email is invalid ";
  }

  // check that email is not an invalid email server.

  // check that the phone number is filled.
  // check that the number has at min 10 digits.
  if (
    f.phone_num === "" &&
    f.phone_num.length < 10 &&
    isPhoneNumber(f.phone_num)
  ) {
    fb.warning += "\n Your phone number is invalid.";
  }

  // check password was filled,
  // Password must be at least 8 characters.
  // confirm password and password must match.
  if (
    f.password === "" &&
    f.password.length < 10 &&
    f.password !== f.password_confirm
  ) {
    fb.warning += "\n Your password is invalid";
  }

  // if errors, respond with feedback else write to DB.
  if (fb.warning !== "") {
    res.render("../views/pages/sign_up_page", fb);
  } else {
    bcrypt.hash(
      f.password,
      parseInt(process.env.SALT_ROUNDS),
      async (e, hashed_pw) => {
        if (e) {
          console.log(e);
          res.render("pages/sign_up_page", {
            error: "Backend Error. Call Admin (111000)",
          });
          return;
        } else {
          try {
            // Query the DB for email.
            result = await pool.query(
              "select create_user($1, $2, $3, $4, $5, $6, $7);",
              [
                f.f_name,
                f.l_name,
                f.email,
                f.phone_num,
                f.pref_moc,
                "basic",
                hashed_pw,
              ]
            );
          } catch (err) {
            console.log(err);
            let response_error = undefined;
            if (err.code === "23505") {
              response_error = "That email is already being used.";
            } else {
              response_error = "Backend Error. Call Admin (110000)";
            }
            res.render("pages/sign_up_page", {
              error: response_error,
            });
            return;
          }

          res.render("index", { message: "You're account has been created. " });
        }
      }
    );
  }
}

module.exports = creatingNewUser;
