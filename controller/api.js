"use strict";
// const sequelize = require('sequelize');
const { QueryTypes } = require("sequelize");
const db = require("../models");
const dd = require("dump-die");
let DynamicsCrmRest = require("./src/dynamics");

class homeController {
  async view(req, res, next) {
    const users = await db.sequelize.query("SELECT * FROM `users`", {
      type: QueryTypes.SELECT,
    });
    let crm = new DynamicsCrmRest();
    await crm.get("leads?$top=3").then((result) => {
      dd(result);
      res.render("index", { title: "View!" });
    });
  }

  async post(req, res) {
    let coordinates = {};
    coordinates.latitude = Number(req.query.latitude) || false;
    coordinates.longitude = Number(req.query.longitude) || false;
    coordinates.distance = req.query.distance || 5;

    if ( false === coordinates.longitude || false === coordinates.latitude || isNaN(coordinates.latitude) || isNaN(coordinates.longitude) ||  ( ! isFinite(coordinates.latitude) || Math.abs(coordinates.latitude) > 90) || ( ! isFinite(coordinates.longitude) || Math.abs(coordinates.longitude) > 180) ) {
      res.status(400).send({
        error:
          "Invalid query parameter detected. Please pass valid latitude and longitude parameters.",
      });
    }

    let sqlQuery = `
    SELECT 
    id, address, name, 
    CONCAT(ST_Y(coordinates), ',' ,ST_X(coordinates)) AS latLong,
    (6371 * ACOS(COS(RADIANS(${coordinates.latitude})) * COS(RADIANS(ST_Y(coordinates))) 
    * COS(RADIANS(ST_X(coordinates)) - RADIANS(${coordinates.longitude})) + SIN(RADIANS(${coordinates.latitude}))
    * SIN(RADIANS(ST_Y(coordinates))))) AS distance
    FROM geolocation
    WHERE MBRContains
        (
        LineString
            (
            Point (
                ${coordinates.longitude} + ${coordinates.distance} / (111.320 * COS(RADIANS(${coordinates.latitude}))),
                ${coordinates.latitude} + ${coordinates.distance} / 111.133
            ),
            Point (
                ${coordinates.longitude} - ${coordinates.distance} / (111.320 * COS(RADIANS(${coordinates.latitude}))),
                ${coordinates.latitude} - ${coordinates.distance} / 111.133
            )
        ),
        coordinates
        )
    HAVING distance < ${coordinates.distance}
    ORDER By distance`;

    const resultsAgents = await db.sequelize.query(sqlQuery, {
      type: QueryTypes.SELECT,
    });

    res.json({
      coordinates: coordinates,
      results: resultsAgents,
    });
  }
}

module.exports = new homeController();
