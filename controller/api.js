'use strict';
// const sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');
const db = require("../models");
const dd = require("dump-die");
let DynamicsCrmRest = require('./src/dynamics');

class homeController {

  async view( req, res, next ) {
    const users =  await db.sequelize.query("SELECT * FROM `users`", { type: QueryTypes.SELECT });
    let crm = new DynamicsCrmRest();
    await crm.get("leads?$top=3").then( result => { 
      dd(result);
      res.render('index', { title: 'View!' });
    });
  }

  post( req, res, next ) {
    console.log('post!');
    res.render('index', { title: 'Posted!' });
  }
}


module.exports = new homeController();
