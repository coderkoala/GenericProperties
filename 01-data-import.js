"use strict";
require('dotenv').config();
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
      filename: "./logs/error.log",
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

// Begin process.
try {
  fs.createReadStream("./logs/crm.csv")
    .pipe(csv())
    .on("data", function (row) {
      logger.log({
        level: "info",
        message: `[SUCCESS] ${row.id} - ${row.name} located at ${row.latitude},${row.longitude} mapped tuple.`,
      });
      mappedData.push(row);
    })
    .on("end", function () {
      db.bulkCreate(mappedData)
        .then(() => {
          logger.log({
            level: "info",
            message: `[SUCCESS] ${mappedData.length} dataset imported successfully.`,
          });
        })
        .catch((exception) => {
          logger.log({
            level: "error",
            message: JSON.stringify(exception),
          });
        });
    });
} catch (e) {
  //
}
