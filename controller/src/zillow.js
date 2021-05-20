"use strict";
require("dotenv").config();
const axios = require("axios");

class ZillowREST {
  get(zillowPropertyID) {
    const instance = axios.create({
      baseURL: `https://www.zillow.com/webservice/GetZestimate.htm?zws-id=${process.env.zillow_api_key}&zpid=${zillowPropertyID}`,
      timeout: 0,
      transformResponse: (res) => {
        // Do your own parsing here if needed ie JSON.parse(res);
        return res;
      },
    });
    return instance.get().catch((error) => error);
  }
}

module.exports = ZillowREST;
