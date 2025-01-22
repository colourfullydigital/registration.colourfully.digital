// Third-party packages
const express = require("express");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");

// Utilities
const defaultData = require("./utils/defaultData");

// Routes
const { auth, logOut } = require("./routes/authentication");
const landing = require("./routes/landingPage");
const accountRoute = require("./routes/accountRoute");
const dependents = require("./routes/dependentsRoute");
const programs = require("./routes/programsRoute");
const { aboutRoute, contactRoute } = require("./routes/contactAndAboutRoute");

const config = {
  port: process.env.PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET || "fallback-secret-dev-only",
  url: process.env.URL || "http://localhost",
};

const app = express();

app.set("view engine", "ejs");

const memoStore = new session.MemoryStore();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: memoStore,
    cookie: { secure: false, sameSite: "lax", maxAge: 1000 * 60 * 30 },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // 'public' is the folder containing your css, js and other static files
app.use(defaultData);

app.use(expressLayouts);
app.set("layout", "layouts/default");

// Auth routes
app.use("/sign_in", auth);
app.use("/sign_out", logOut);
app.use("/sign_up", accountRoute);

// Feature routes
app.use("/dependents", dependents);
app.use("/programs", programs);

// Core routes
app.use("/", landing);
app.use("/about", aboutRoute)
app.use("/contact", contactRoute)


// After all routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {
    error:
      process.env.NODE_ENV === "development" ? err : "Internal Server Error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(config.port, () => {
  console.log(`Server is running on ${config.url}:${config.port}`);
});

