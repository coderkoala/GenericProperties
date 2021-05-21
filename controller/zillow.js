"use strict";
const e = require("express");
let zillowREST = require("./src/zillow");

class zillowController {
  async fetchXMLAPI(req, res, next) {
    let zpid = Number(req.query.zpid);
    if ( isNaN(zpid) ) {
      res.status(400).send({
        error:
          "Invalid Zillow Property ID.",
      });
    } else {
      let zillow = new zillowREST();
      await zillow
        .get(zpid)
        .then((result) => {
          if ( result.data ) {
            res.send(result.data);
          } else {
            res.status(400).send({
              error:
                "Couldn't retrieve data from remote server.",
            });
          }
        });  
    }
  }
}

module.exports = new zillowController();
