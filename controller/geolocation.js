"use strict";
// const sequelize = require('sequelize');
const { QueryTypes } = require("sequelize");
const db = require("../models");
let DynamicsCrmRest = require("./src/dynamics");
const dotenv = require("dotenv");

class homeController {
  async view(req, res, next) {
    let newlat = req.body.latLong;

    // const users = await db.sequelize.query("SELECT * FROM `users`", {
    //   type: QueryTypes.SELECT,
    // }); Just test code.
    res.render("geolocation", { title: "Geolocation" });
  }

  async post(req, res, next) {
    let leadid =
      undefined === req.body.location ||
      req.body.location.match(/(^\s+$|^$)|((@|\||\*|\^|\_|%|!|~|\+)+)/i)
        ? "!invalid"
        : `(${req.body.location})`;

    let crm = new DynamicsCrmRest();
    await crm
      .get(
        `leads${leadid}?$select=new_latitude,new_longitude,subject,new_fullname`
      )
      .then((result) => {
        if (undefined !== result.data) {
          result.data.hotLink =
            process.env.dynamics_crm_record_link.replace("{entity}", "lead") +
            result.data.leadid;
          res.json(result.data);
        } else {
          res.status(404).send({
            error:
              "No lead records found. Please try again with a valid record.",
          });
        }
      });
  }

  async fetchAgents(req, res, next) {
    res.json(req.body);
    let latitude = this.latitude;
    let longitude = this.longitude;
    let query = `SELECT 
                id, address, name, 
                CONCAT(ST_Y(coordinates), ',' ,ST_X(coordinates)) AS latLong,
                (6371 * ACOS(COS(RADIANS(${latitude})) * COS(RADIANS(ST_Y(coordinates))) 
                * COS(RADIANS(ST_X(coordinates)) - RADIANS(${longitude})) + SIN(RADIANS(${latitude}))
                * SIN(RADIANS(ST_Y(coordinates))))) AS distance
                FROM geolocation
                WHERE MBRContains
                    (
                    LineString
                        (
                        Point (
                            ${longitude} + 30 / (111.320 * COS(RADIANS(${latitude}))),
                            ${latitude} + 30 / 111.133
                        ),
                        Point (
                            ${longitude} - 30 / (111.320 * COS(RADIANS(${latitude}))),
                            ${latitude} - 30 / 111.133
                        )
                    ),
                    coordinates
                    )
                HAVING distance < 5
                ORDER By distance`;
  }
}

module.exports = new homeController();
