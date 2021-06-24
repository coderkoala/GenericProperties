'use strict';

// Loading a few environment variables.
require("dotenv").config();


// Begin importing the dependencies.
const db = require("./models").Geolocation;
var fs = require("fs");
var csv = require("csv-parser");
const winston = require("winston");

let mappedData = [];

// Log info so we know what rows failed imports.
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({
      filename: "./logs/migrations.log",
      level: "error",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
try {
  let hotLink = `https://msvproperties.crm.dynamics.com/api/data/v9.0/leads`;
    console.log(hotLink);
    throw 'error';
} catch(e){
  console.log(
    `\x1b[31m[SIGTERM] Reason: Migration failed. You can check the logs generated on : migrations.log\x1b[0m`
  );
}


