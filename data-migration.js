"use strict";

// Loading a few environment variables.
require("dotenv").config();

// Begin importing the dependencies.
const db = require("./models").Geolocation;
const winston = require("winston");
const dynamics = require("./controller/src/dynamics");

class dynamicsMigration {
  constructor() {
    this.count = 1;
    this.mappedData = {}; // Data container for fetching and processing data.
    this.dataNextLink = ""; // The next link for recursive API calls(For the next 5000 dataset batch).

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
    let dataToInsert = [];
    let localDataTuple = data || this.mappedData.data.value || [];
    localDataTuple.forEach((dataTuple) => {
      dataToInsert.push({
        id: dataTuple.cr4f2_agentsandrealtorid,
        name: dataTuple.cr4f2_fullname,
        email: dataTuple.new_email,
        phone: dataTuple.new_phone,
        company: dataTuple.new_companyname,
        address: dataTuple.new_address,
        latitude: dataTuple.new_latitude,
        longitude: dataTuple.new_longitude,
        createdAt: dataTuple.createdon,
        updatedAt: dataTuple.modifiedon,
      });
    });

    // Let sequelize handle duplicates, bulk create the fresh ones.
    try {
      await db.bulkCreate(dataToInsert, {
        fields: [
          "id",
          "name",
          "email",
          "phone",
          "company",
          "address",
          "latitude",
          "longitude",
          "createdAt",
          "updatedAt",
        ],
        updateOnDuplicate: ["id"],
      });
    } catch(e) {
      this.logger.log({
        level: "error",
        message: `[ERROR] Pull failed on: ${this.dataNextLink}`,
      });
    }


    console.log(
      `\x1b[34m[IMPORT] Importing ${
        this.count * dataToInsert.length
      } records.\x1b[0m`
    );

    // Free memory.
    return delete this.mappedData;
  }

  async init(param) {
    try {
      // Declarations for the migration start.
      await this.fetchData(param);

      // Actual migration happens here.
      try {
        if (
          "undefined" !== typeof this.mappedData.data &&
          "undefined" !== typeof this.mappedData.data["@odata.context"]
        ) {
          do {
            try {
              this.dataNextLink = this.mappedData.data["@odata.nextLink"];
            } catch (e) {
              this.dataNextLink = false;
            }
            await this.processData();
            await this.processNextLink(this.dataNextLink);
            if (false !== this.dataNextLink) {
              console.log(
                `\x1b[34m[FETCH] Importing data from endpoint: cr4f2_agentsandrealtors for another 5000 records.\x1b[0m`
              );
              await this.fetchData(this.dataNextLink);
            }
          } while (false !== this.dataNextLink);
          this.quitOnSuccess();
        } else {
          throw "The server couldn't be reached for polling data.";
        }
      } catch (e) {
        throw e;
      }
    } catch (e) {
      // Failure in fetching, bail quickly.
      this.quitOnException(e);
    }
    await this.finalizeMigration();
  }

  async processNextLink() {
    try {
      if (this.dataNextLink.match(/cr4f2_agentsandrealtors.*/gi).length) {
        this.dataNextLink = this.dataNextLink.match(
          /cr4f2_agentsandrealtors.*/gi
        )[0]; // Cherry-pick the endpoint only.
      } else {
        this.dataNextLink = false;
      }
    } catch (e) {
      this.dataNextLink = false;
    }
  }

  // Recomputes all the geolocation into
  // the point form used in Harvesine formula.
  async finalizeMigration() {
    console.log(`\x1b[34m[PRUNING] Pruning database, please wait.\x1b[0m`);
    await db.sequelize.query(
      `DELETE FROM 
      geolocation 
      WHERE 
      latitude=NULL 
      OR latitude='' 
      OR 
      longitude='' 
      OR longitude=NULL`
    );
    console.log(
      `\x1b[34m[FINALIZING] Recomputing all point vectors for geolocation, this might take a while.\x1b[0m`
    );
    await db.sequelize.query(
      `UPDATE 
      geolocation 
      SET coordinates=POINT(longitude,latitude);`
    );
  }

  quitOnException(e = "") {
    let message =
      "" === e
        ? `\x1b[31m[SIGTERM] Reason: Migration failed. Unknown Exception occured.\x1b[0m`
        : `\x1b[31m[SIGTERM] Reason: Migration failed. You can check the logs generated on : migrations.log\x1b[0m\n\nException: ${e}`;
    this.logger.log({
      level: "error",
      message: `[ERROR] Import failed due to exception resulting in SIGTERM: ${e}`,
    });
    this.logger.log({
      level: "error",
      message: `[Failed at] : ${this.dataNextLink}`,
    });
    console.log(message);
  }

  quitOnSuccess() {
    this.logger.log({
      level: "info",
      message: `[SUCCESS] Imported data successfully. Please check migrations log for more information.`,
    });
    console.log(
      `\x1b[32m[SUCCESS] Migrations were successful. Logs generated on : migrations.log\x1b[0m`
    );
  }
}

let runMigrations = new dynamicsMigration();
runMigrations.init(process.argv.slice(2).pop() || "cr4f2_agentsandrealtors");
