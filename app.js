"use strict";

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cache = require("persistent-cache");
require("dotenv").config();

// Import route files.
const homeRouter = require("./routes/frontend");
const adminRouter = require("./routes/backend");

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// EJS Setup and init.
app.engine("ejs", require("express-ejs-extend"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Basic Router Configuration.
app.use("/", homeRouter);
app.use("/api", adminRouter);

// Check DB, send sigterm if connection can't be established.
const db = require("./models");
db.sequelize
  .sync()
  .catch(() => {
    console.log(
      `\x1b[31m[SIGTERM] Reason: Invalid Database connection.\x1b[0m`
    );
    process.exit();
  })
  .then(() => {
    // Flush cache folder.
    const fs = require("fs");
    fs.rmdirSync("logs", { recursive: true });
    const cacheInstance = cache({
      base: "logs",
      name: "cacheDB",
      duration: 3600000,
    });
    cacheInstance.unlink(function (err) {
      if (err) {
        console.log(`\x1b[31m[CACHE]${err}\x1b[0m`);
      } else {
        console.log(`\x1b[33m[CACHE] Cache succesfully reinitialized.\x1b[0m`);
      }
    });
  });

// Some basic middleware setup upon the stack.
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error Handler.
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === "development" ? err : {};

  // Render Status Page (500):
  res.status(err.status || 500);
  res.render("error");
});

// Lastly, export it to global modules Express uses.
module.exports = app;
