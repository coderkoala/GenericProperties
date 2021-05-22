"use strict";
require("dotenv").config();
const winston = require("winston");

class Logger {
  constructor() {
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
        new winston.transports.File({ filename: "./logs/combined.log" }),
      ],
    });

    if (process.env.NODE_ENV !== "production") {
      logger.add(
        new winston.transports.Console({
          format: winston.format.simple(),
        })
      );
    }

    return logger;
  }
}

module.exports = new Logger();
