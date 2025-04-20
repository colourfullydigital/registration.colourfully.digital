// Programs (events) CRUD
const pool = require("./../db");

function prepareDashboardData(list) {
  const maxDesLength = 200;
  list.forEach(e => {
    if (e.description.length > maxDesLength) {
      e.description = e.description.substr(0, maxDesLength) + "...";
    }

    e.capacity = ((e.num_registered / e.capacity) * 100).toFixed(0);
    e.num_registered = undefined;

    e.utc_start_date = ((new Date(e.utc_start_date.setHours(0, 0, 0, 0))) - (new Date()).setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24);
    e.utc_start_date = e.utc_start_date.toFixed(0);
    if (e.utc_start_date > 0) {
      e.utc_start_date = Math.abs(e.utc_start_date) + " days remaining";
    } else if (e.utc_start_date < 0) {
      e.utc_start_date = e.utc_start_date = Math.abs(e.utc_start_date) + " days ago";
    } else {
      e.utc_start_date = "Today";
    }

  });

  return list;
}


// read/get programs (access to all. )programs
async function getPrograms(req, res) {

  let query = undefined;
  let result = undefined;
  if (req.session.user && req.session.role === 'admin') {
    // If user is admin query for draft and other programs. 
    query = `select 
      id, name, description, capacity, num_registered, utc_start_date, location, status
    from programs;`;
  } else {
    // If user is basic only get upcomming programs. 
    query = `select 
      id, name, description, capacity, num_registered, utc_start_date, location, status 
    from programs 
      where status in ('scheduled', 'active', 'postponed', 'cancelled');`
  }

  // Query the DB
  try {
    result = await pool.query(query);
  } catch (e) {
    console.log(e);
  }

  // Attach result to res and render program
  res.locals.dashboard = [];
  if (result.rowCount > 0) {
    res.locals.dashboard = prepareDashboardData(result.rows);
  }

  if (req.session.user) {
    res.locals.role = req.session.role;
  } else {
    res.locals.role = 'nothing';
  }
  res.render('../views/pages/programs')

}

// read/get a program for basic users
async function getProgram(req, res) {
  const id = req.params.id;
  let result = undefined;
  const output = {};
  try {
    const query = `select 
      pro.id as id, org.name as org_name, pro.name, pro.description, pro.capacity, pro.num_registered, pro.utc_start_date, pro.utc_end_date, pro.location, users.first_name, pro.status, pro.utc_creation_time 
    from 
      programs as pro, organizations as org, users 
    where 
      pro.organization_id = org.id and pro.instructor_id=users.id and pro.id=$1;`;
    result = await pool.query(query, [id]);
  } catch (e) {
    console.error(e);
  }

  if (result.rowCount > 0) {
    // console.log(result.rows[0])
    output.program = result.rows[0];
  }

  try {
    const query = "select name from organizations;"
    result = await pool.query(query);
  } catch (e) {
    console.error(e);
  }

  if (result.rowCount > 0) {
    output.organizations = result.rows;
  }

  try {
    const query = "select first_name as name from users where role = 'admin';";
    result = await pool.query(query);
  } catch (e) {
    console.error(e);
  }

  if (result.rowCount > 0) {
    output.instructors = result.rows;
  }

  res.json(output);

}


// create a program (admin only)
// Update a program (admin only)
// delete a program (admin only)


module.exports = { getPrograms, getProgram }