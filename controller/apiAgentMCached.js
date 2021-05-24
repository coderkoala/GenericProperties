"use strict";
let view = require("./src/agentViewHelper");
const cacheClass = require("persistent-cache");
require("dotenv").config();

class leadController {
  fetchLeadsRelatedAgentsFromCache(req, res) {
    let cache = cacheClass({
      base: "logs",
      name: "cacheDB",
      duration: 3600000,
    });

    let leadid =
      undefined === req.query.id ||
      null === req.query.id ||
      req.query.id.match(/(^\s+$|^$)|((@|\||\*|\^|\_|%|!|~|\+)+)/i)
        ? `^invalid`
        : `${req.query.id}`;

    if ("^invalid" === leadid) {
      res.status(400).json({
        error: "Validation failed for the lead UUID.",
      });
      return;
    }
    
    // Poll the cache for the given leadid.
    let agentCachedResults = null;
    agentCachedResults = cache.getSync(`${leadid}-raw`);
    agentCachedResults = agentCachedResults && undefined !== agentCachedResults.rawData ? agentCachedResults.rawData : false;

    if (agentCachedResults) {
      const viewEngine = new view(agentCachedResults);
      let template = viewEngine.outputAgentsCollection();
      res.json(template);
      return;
    } else {
      res.status(400).json({
        error: "Session has expired.",
        reason: "Computed data no longer available, please refresh the window and try again."
      });
      return;
    }
  }
}

module.exports = new leadController();
