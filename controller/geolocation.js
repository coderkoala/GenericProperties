"use strict";
let DynamicsCrmRest = require("./src/dynamics");
require("dotenv").config();

class homeController {
  async view(req, res, next) {
    res.render("geolocation", { title: "Geolocation", apiKey: process.env.geolocation_api_key || 'invalid' });
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
        `leads${leadid}?$select=new_latitude,new_longitude,subject,new_fullname,new_street`
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
              "No lead records found. Please try again with a valid record UUID.",
          });
        }
      });
  }
}

module.exports = new homeController();
