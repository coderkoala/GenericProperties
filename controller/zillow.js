"use strict";
const { QueryTypes } = require("sequelize");
const db = require("../models");
let DynamicsCrmRest = require("./src/dynamics");
require("dotenv").config();

class zillowController {

  async fetchXMLAPI(req, res, next) {
    // Todo implementation
  }
}

module.exports = new zillowController();
