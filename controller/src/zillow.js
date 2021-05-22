"use strict";
require("dotenv").config();
const axios = require("axios");

class ZillowREST {
  get(zillowPropertyID) {
    const instance = axios.create({
      baseURL: `https://www.zillow.com/webservice/GetZestimate.htm?zws-id=${process.env.zillow_api_key}&zpid=${zillowPropertyID}`,
      timeout: 0,
      transformResponse: (res) => {
        if ( 'string' === typeof res ) {
          return res;
        } else {
          return res.toString();
        }
      },
    });
    return instance.get().catch((error) => error);
  }
}

module.exports = ZillowREST;
