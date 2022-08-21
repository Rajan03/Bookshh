const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const connectDB = require("./config/db");

// load config
dotenv.config({ path: "./config/config.env" });
const PORT = process.env.PORT || 8080;

// Passport Config
require("./config/passport")(passport);

// Database
connectDB();

const app = express();

// body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Logging Requests
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// static
app.use(express.static(path.join(__dirname, "public")));

// Session Middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());

// Global Variable
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/books", require("./routes/books"));

app.listen(PORT, console.log(`Server is up at ${PORT}`));
