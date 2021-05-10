'use strict';
// const sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');
const db = require("../models");

class homeController {

  async view( req, res, next ) {
    const users =  await db.sequelize.query("SELECT * FROM `users`", { type: QueryTypes.SELECT });
    res.render('geolocation', { title: 'Geolocation' });
  }

  post( req, res, next ) {
    console.log('post!');
    res.render('geolocation', { title: 'Geolocation' });
  }
}


module.exports = new homeController();
