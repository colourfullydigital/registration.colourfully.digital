const express = require("express");
const session = require("express-session");
const pool = require("./db");
const { auth, logOut } = require("./routes/authentication");
const landing = require("./routes/landingPage");
const accountRoute = require("./routes/accountRoute");
const dependents = require("./routes/dependentsRoute");
const programs = require("./routes/programsRoute");

const PORT = process.env.PORT || 3000;
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
app.use(express.static("public")); // 'public' is the folder containing your styles.css

app.use("/", landing);
app.use("/sign_in", auth);
app.use("/sign_out", logOut);
app.use("/sign_up", accountRoute);
app.use("/dependents", dependents);
app.use("/programs", programs);
// Other routes for dependents and login information can be added here

app.listen(PORT, () => {
  console.log(`Server is running on ${process.env.URL}:${PORT}`);
});
