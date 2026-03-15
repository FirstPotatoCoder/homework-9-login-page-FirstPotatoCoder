const express = require("express");
const cookieParser = require("/cookie-parser");
const session = require("express-session");
const path = require("path");
const { engine } = require("express-handlebars");

const app = express();

// me too lamzy to put in .env
const COOKIE_SECRET = "c00k!eS3cr3t_X#92mZ$qL";
const SESSION_SECRET = "s3ss!0nS3cr3t_Y#47nW$pK";

const users = {
  admin: {
    username: "admin",
    password: "password123",
    fullName: "System Administrator",
    email: "admin@university.edu",
    bio: "Managing the campus network infrastructure.",
  },
  student_dev: {
    username: "student_dev",
    password: "dev_password",
    fullName: "Jane Developer",
    email: "jane.d@student.edu",
    bio: "Full-stack enthusiast and coffee drinker.",
  },
};

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views", "layouts"),
    helpers: {
      eq: (a, b) => a === b,
    },
  }),
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(COOKIE_SECRET));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    },
  }),
);

function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect("/login");
}

function getTheme(req) {
  return req.signedCookies.top_secret_theme || "light";
}

app.get("/", (req, res) => {
  res.redirect(req.session.user ? "/profile" : "/login");
});

app.get("/login", (req, res) => {
  if (req.session.user) return res.redirect("/profile");
  res.render("login", {
    layout: "main",
    theme: getTheme(req),
    error: req.query.error || null,
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users[username];

  if (!user || user.password !== password) {
    return res.redirect("/login?error=Invalid+username+or+password");
  }

  req.session.user = {
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    bio: user.bio,
  };

  res.redirect("/profile");
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error("Session destroy error:", err);
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

app.get("/profile", requireAuth, (req, res) => {
  res.render("profile", {
    layout: "main",
    theme: getTheme(req),
    user: req.session.user,
  });
});

app.get("/toggle-theme", (req, res) => {
  const current = req.signedCookies.top_secret_theme || "light";
  const next = current === "light" ? "dark" : "light";

  res.cookie("top_secret_theme", next, {
    signed: true,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  });

  const referer = req.headers.referer || "/";
  res.redirect(referer);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
