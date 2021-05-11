'use strict';
// const sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');
const db = require("../models");
let DynamicsCrmRest = require('./src/dynamics');


class homeController {

  async view( req, res, next ) {
    const users =  await db.sequelize.query("SELECT * FROM `users`", { type: QueryTypes.SELECT });
    res.render('geolocation', { title: 'Geolocation' });
  }

  async post( req, res, next ) {
    let leadid = req.body.location || '?$top=1';
    let crm = new DynamicsCrmRest();
    await crm.get(`leads${leadid}`).then( result => {
      if ( undefined !== result.data &&  undefined !== result.data.value ) {
        res.json( result.data.value );
      } else {
        res.json( [] );
      }
    });
  }
}

module.exports = new homeController();
