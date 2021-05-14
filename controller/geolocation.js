"use strict";
const { QueryTypes } = require("sequelize");
const db = require("../models");
let DynamicsCrmRest = require("./src/dynamics");
require("dotenv").config();

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
}

module.exports = new homeController();
