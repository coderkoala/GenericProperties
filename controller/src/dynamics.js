"use strict";
require('dotenv').config();
const cacheClass = require("persistent-cache");
const axios = require("axios");
const AuthenticationContext = require("adal-node").AuthenticationContext;

class DynamicsCrmRest {
  constructor() {
    this.params = {
      orgName: process.env.dynamics_orgName,
      orgDomain: process.env.dynamics_orgDomain,
      clientId: process.env.dynamics_clientId,
      secret: process.env.dynamics_secret,
      resource: process.env.dynamics_resource  
    };
  }

  getparams() {
    return this.params;
  }

  auth(params) {
    var context = new AuthenticationContext(
      "https://login.windows.net/" + this.params.orgDomain
    );
    return new Promise((resolve, reject) => {
      context.acquireTokenWithClientCredentials(
        params.resource,
        params.clientId,
        params.secret,
        function (err, tokenResponse) {
          if (err) {
            reject(err);
          } else {
            resolve({
              token: tokenResponse.accessToken,
              org: params.orgName,
            });
          }
        }
      );
    });
  }

  get(endPoint) {
    let cache = cacheClass({
      base: "logs",
      name: "cacheDB",
      duration: 3600000,
    });

    return this.auth(this.params).then(function (result) {
      // cache.putSync('aadl_token', { bearer: result.token });
      const instance = axios.create({
        baseURL: `https://${result.org}.api.crm.dynamics.com/api/data/v9.0/${endPoint}`,
        timeout: 0,
        headers: {
          "OData-MaxVersion": "4.0",
          "OData-Version": "4.0",
          Accept: "application/json",
          Authorization: "Bearer " + result.token,
        },
      });
      return instance.get().catch( error => error );
    });
  }
}

module.exports = DynamicsCrmRest;
