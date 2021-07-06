"use strict";

// Loading a few environment variables.
require("dotenv").config();

// Begin importing the dependencies.
const db = require("./models").Geolocation;
var fs = require("fs");
var csv = require("csv-parser");
const winston = require("winston");
const dynamics = require("./controller/src/dynamics");

class dynamicsMigration {
  constructor() {
    this.mappedData = {}; // Data container for fetching and processing data.
    this.dataNextLink = ''; // The next link for recursive API calls(For the next 5000 dataset batch).

    // Log info so we know what rows failed imports.
    this.logger = winston.createLogger({
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

    // Safety and additional checks if in production - gotta be careful.
    if (process.env.NODE_ENV !== "production") {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.simple(),
        })
      );
    }
  }

  getSingleTonDynamicsInstance() {
    if (
      undefined === typeof this.dynamicsInstance ||
      "object" !== typeof this.dynamicsInstance
    ) {
      try {
        this.dynamicsInstance = new dynamics();
        return this.dynamicsInstance;
      } catch (e) {
        this.quitOnException(e);
      }
    } else {
      return this.dynamicsInstance;
    }
  }

  async fetchData(url = "") {
    let dynamicsInstance = this.getSingleTonDynamicsInstance();
    let urlEndpoint = "" === url ? `cr4f2_agentsandrealtors` : url;
    this.mappedData = await dynamicsInstance.get(urlEndpoint);
    return this.mappedData;
  }

  async processData(data = undefined) {
    let localDataTuple = data || this.mappedData.data.value;
    console.log(typeof localDataTuple);
    // Todo: Begin dataprocessing, opening and closing DB transaction here.
    // console.dir(localDataTuple[0]);
  }

  async init() {
    try {
      // Declarations for the migration start.
      await this.fetchData();

      // Actual migration happens here.
      try {
        if( 'undefined' !== typeof this.mappedData.data && 'undefined' !== typeof this.mappedData.data['@odata.context'] ) {
          this.dataNextLink = this.mappedData.data['@odata.nextLink'] || ''; // Todo: Regex out the endpoint with cookie params.
          this.processData();
        } else {
          throw 'The server couldn\'t be reached for polling data.';
        }
      } catch(e){
        throw 'Server error, the given dataset couldn\'t be resolved.';
      }
      
    } catch (e) {
      // Failure in fetching, bail quickly.
      this.quitOnException(e);
    }
  }

  quitOnException(e = "") {
    // Todo: Reverse the action of migration. 
    // Todo: Rollback the transaction if it fails mid-flight.
    // Todo: log what exactly caused the failure, then dispatch an email to author informing.
    let message =
      "" === e
        ? `\x1b[31m[SIGTERM] Reason: Migration failed. Unknown Exception occured.\x1b[0m`
        : `\x1b[31m[SIGTERM] Reason: Migration failed. You can check the logs generated on : migrations.log\x1b[0m\n\nException: ${e}`;
    console.log(message);
  }

  quitOnSuccess() {
    // Todo, close log, do cleanup, and exit gracefully.
    console.log(
      `\x1b[32m[SUCCESS] Migrations were successful. Restarting service. Logs generated on : migrations.log\x1b[0m`
    );
  }
}

let runMigrations = new dynamicsMigration();
runMigrations.init();
