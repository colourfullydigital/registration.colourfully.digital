const pool = require("../db");

function calculateAge(dateOfBirth) {
  // Parse the dateOfBirth string into a Date object
  const birthDate = new Date(dateOfBirth);

  // Get the current date
  const currentDate = new Date();

  // Calculate the age in years
  let age = currentDate.getFullYear() - birthDate.getFullYear();

  // Check if the birthday has occurred this year yet
  const monthDifference = currentDate.getMonth() - birthDate.getMonth();
  const dayDifference = currentDate.getDate() - birthDate.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--; // Subtract 1 if the birthday hasn't occurred yet this year
  }

  return age;
}

async function createDependent(req, res) {
  let result = undefined;
  const { first_name, last_name, birthday, gender } = req.body;
  try {
    result = await pool.query(
      `
    insert into dependents 
      (user_id, birthday, gender, first_name, last_name) 
    values ( $1, $2, $3, $4, $5);
    `,
      [req.session.user, birthday, gender, first_name, last_name]
    );
  } catch (e) {
    console.log(e);
    return;
  }
  res.redirect("/dependents");
}

async function updateDependent(req, res) {
  let user_id = req.session.user;
  let result = undefined;
  const { id, first_name, last_name, birthday, gender } = req.body;
  if (req.session.user) {
    // Check that kid belongs to current user
    try {
      result = await pool.query(
        "select $1 in (select id from dependents where user_id = $2) as test;",
        [id, user_id]
      );
    } catch (e) {
      console.log(e);
      res.redirect("/dependents");
      return;
    }
    // If kid belongs, update their info,
    // console.log(result);
    if (result && result.rowCount > 0 && result.rows[0].test) {
      try {
        result = await pool.query(
          `update 
            dependents 
          set 
            (birthday, gender, first_name, last_name) = ($1, $2, $3, $4) 
          where id=$5;`,
          [birthday, gender, first_name, last_name, id]
        );
      } catch (e) {
        console.log(e);
        res.redirect("/dependents");
        return;
      }
      res.redirect("/dependents");
    }
  }

  // If kid don't belong don't change anything.

  // redirect to dependents page.
}

async function getDependent(req, res) {
  // get the value of a single dependent
  let id = req.params.id;
  if (!id) {
    console.log("Error happening here (2341234123)");
    res.render("../views/pages/dependents", {
      error: "Backend Error. Call Admin (0101001010)",
    });
    return;
  }

  let result = undefined;
  if (req.session.user) {
    try {
      result = await pool.query(`select * from dependents where id = ${id};`);
    } catch (e) {
      console.log(e);
      res.render("../views/pages/dependents", {
        error: "Backend Error. Call Admin (011011011101)",
      });
      return;
    }
    if (result.rowCount > 0) {
      res.json(result.rows[0]);
    } else {
      res.redirect("/dependents");
    }
  }
}

async function getDependents(req, res) {
  // get the list of dependents and returns them to the user.
  let result = undefined;
  let result1 = undefined;

  try {
    result = await pool.query(
      `
      select 
        id, first_name, last_name, birthday, gender 
      from 
        dependents 
      where 
        user_id = $1;`,
      [req.session.user]
    );

    result1 = await pool.query(
      `select first_name from users where id=${req.session.user};`
    );
  } catch (e) {
    console.log(err);
    res.render("../views/pages/dependents", {
      error: "Backend Error. Call Admin (010010)",
    });
    return;
  }

  const package = {
    first_name: result1.rows[0].first_name,
    dependents: result.rows,
  };
  package.dependents.forEach((e) => (e.birthday = calculateAge(e.birthday)));

  res.render("../views/pages/dependents", package);
}

async function deleteDependent(req, res) {
  const id = req.body.id;
  const user_id = req.session.user;
  let result = undefined;
  if (id) {
    try {
      result = await pool.query(
        "select $1 in (select id from dependents where user_id = $2) as test;",
        [id, user_id]
      );
    } catch (e) {
      console.log(e);
    }

    if (result && result.rowCount > 0 && result.rows[0].test) {
      try {
        result = await pool.query(`delete from dependents where id = $1;`, [
          id,
        ]);
      } catch (e) {
        console.log(e);
      }
    }
  }
  res.redirect("/dependents");
}

module.exports = {
  getDependents,
  getDependent,
  updateDependent,
  createDependent,
  deleteDependent,
};
