"use strict";
const { QueryTypes } = require("sequelize");
const db = require("../models");
let DynamicsCrmRest = require("./src/dynamics");
require("dotenv").config();

class zillowController {
  async view(req, res, next) {
    res.render("zillow", { title: "Zillow API", apiKey: process.env.zillow_api_key || 'invalid' });
  }

  async post(req, res, next) {
    // Todo implementation
  }
}

module.exports = new zillowController();
