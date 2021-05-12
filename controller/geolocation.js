"use strict";
// const sequelize = require('sequelize');
const { QueryTypes } = require("sequelize");
const db = require("../models");
let DynamicsCrmRest = require("./src/dynamics");
const dotenv = require('dotenv');

class homeController {
  async view(req, res, next) {
    // const users = await db.sequelize.query("SELECT * FROM `users`", {
    //   type: QueryTypes.SELECT,
    // }); Just test code.
    res.render("geolocation", { title: "Geolocation" });
  }

  async post(req, res, next) {
    let leadid =
      undefined !== req.body.location ? `(${req.body.location})` : "!invalid";
    let crm = new DynamicsCrmRest();
    await crm.get(`leads${leadid}?$select=new_latitude,new_longitude,subject,new_fullname`).then((result) => {
      if (undefined !== result.data) {
        result.data.hotLink = process.env.dynamics_crm_record_link.replace('{entity}', 'lead') + result.data.leadid;
        res.json(result.data);
      } else {
        res
          .status(404)
          .send({
            error:
              "No lead records found. Please try again with a valid record.",
          });
      }
    });
  }
}

module.exports = new homeController();
