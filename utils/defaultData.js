
function data(req, res, next) {

  const pathTail = req.path.replace("/", '').toLowerCase();

  switch (pathTail) {
    case "sign_in":
      // if the title is sign_in then login
      res.locals.title = "Log In";
      res.locals.description = "Login page";
      break;
    case "sign_up":
      // if the title is sign_in then login
      res.locals.title = "Create Account";
      res.locals.description = "Create an Account";
      break;
    case "about":
      // code block
      res.locals.title = "About Us";
      res.locals.description = "Information about who we are and who are our supporters.";
      break;
    case "contact":
      // code block
      res.locals.title = "Contact";
      res.locals.description = "Our contact information";
      break;
    case "dependents":
      // if title is dependents then family
      res.locals.title = "Your family";
      res.locals.description = "Manage and Update information about your family members.";
      break;
    case "programs":
      // code block
      res.locals.title = "Programs and Events";
      res.locals.description = "Information about programs and events which are coming up.";
      break;
    default:
      // If the titlte is / then change it to home. 
      res.locals.title = "Home";
      res.locals.description = "Welcome to STEM Education Portal - Empowering youth through technology education.";
  }
  next();
}

module.exports = data;