'use strict';
const { QueryTypes } = require('sequelize');
const db = require("../models");

class termsController {

  async view( req, res, next ) {
    res.render('terms', { title: 'License' });
  }
}


module.exports = new termsController();
