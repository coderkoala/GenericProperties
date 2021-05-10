'use strict';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Import route files.
const homeRouter = require('./routes/frontend');
// const adminRouter = require('./routes/backend');

const app = express();

// EJS Setup and init.
app.engine('ejs', require('express-ejs-extend'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Some basic middleware setup upon the stack.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Basic Router Configuration.
app.use('/', homeRouter);
// app.use('/admin', adminRouter);

// Setting up Sequelize ORM
const db = require("./models");
db.sequelize.sync().then(() => {
  console.log("[Success] DB connection successful!");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error Handler.
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render Status Page (500):
  res.status(err.status || 500);
  res.render('error');
});

// Lastly, export it to global modules Express uses.
module.exports = app;
