"use strict";
require("dotenv").config();
const { QueryTypes } = require("sequelize");
const db = require("../models");
const cacheClass = require("persistent-cache");
let DynamicsCrmRest = require("./src/dynamics");

class homeController {
  async view(req, res, next) {
    res.render("index", { title: "Agents Geolocation Service" });
  }

  async post(req, res) {
    const leadid = req.query.leadid || false;
    let hotLink = process.env.dynamics_crm_record_link.replace(
      "{entity}",
      "cr4f2_agentsandrealtor"
    );

    let coordinates = {};
    coordinates.latitude = Number(req.query.latitude) || false;
    coordinates.longitude = Number(req.query.longitude) || false;
    coordinates.distance = req.query.distance || 5;

    if (
      false === coordinates.longitude ||
      false === coordinates.latitude ||
      isNaN(coordinates.latitude) ||
      isNaN(coordinates.longitude) ||
      !isFinite(coordinates.latitude) ||
      Math.abs(coordinates.latitude) > 90 ||
      !isFinite(coordinates.longitude) ||
      Math.abs(coordinates.longitude) > 180
    ) {
      res.status(400).send({
        error:
          "The Lead doesn't have valid location info. System will try to initiate forward geolocation encoding.",
      });
    }

    // Only run query if cache misses.
    let resultsAgents = null;
    let pollCache = null;
    let cache = cacheClass({
      base: "logs",
      name: "cacheDB",
      duration: 3600000,
    });

    if (leadid) {
      pollCache = cache.getSync(leadid);
    }

    if (pollCache && undefined !== pollCache.parsedData) {
      // Cache hit!
      res.json({
        data: pollCache.parsedData,
        template: `<table class="table table-hover"><tr><th>Agent Name</th><th>Directions(Google)</th></tr>{0}</table>`,
      });
      return;
    } else {
      let sqlQuery = `
      SELECT 
      id, name, address, email, CONCAT('${hotLink}',geolocation.id) as url,
      phone as phone,
      company as company,
      ST_Y(coordinates) AS latitude,
      ST_X(coordinates) AS longitude,
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
      resultsAgents = await db.sequelize.query(sqlQuery, {
        type: QueryTypes.SELECT,
      });
    }

    let agentsParsed = {};
    let rowTemplate = `<tr><td>{0}</td><td>{2}</td><td>{3}</td></tr>`;

    resultsAgents.forEach((singleTupleAgent) => {
      let index = singleTupleAgent.latitude + "," + singleTupleAgent.longitude;

      // Initialize string if it hasn't been done yet.
      if ("string" !== typeof agentsParsed[index]) {
        agentsParsed[index] = "";
      }

      let rowToBeConcatenated = rowTemplate
        .replace(
          "{0}",
          `<a href="${singleTupleAgent.url}" target="_blank">${singleTupleAgent.name}</a>`
        )
        .replace(
          "{2}",
          `<a href="tel:${singleTupleAgent.phone}" target="_blank">${singleTupleAgent.phone}</a>`
        )
        .replace(
          "{3}",
          `<a href="https://www.google.com/maps/dir/${coordinates.latitude},${coordinates.longitude}/${singleTupleAgent.latitude},${singleTupleAgent.longitude}" target="_blank">${singleTupleAgent.address}</a>`
        );

      agentsParsed[index] += rowToBeConcatenated;
    });

    // Finally, set cache.
    if (leadid) {
      cache.putSync(leadid, { parsedData: agentsParsed });
      cache.putSync(`${leadid}-raw`, { rawData: resultsAgents });
    }

    res.json({
      data: agentsParsed,
      template: `<table class="table table-hover"><tr><th>Agents</th><th>Phone #</th><th>Directions(Google)</th></tr>{0}</table>`,
    });
  }
}

module.exports = new homeController();
