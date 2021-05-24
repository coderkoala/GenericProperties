"use strict";
let DynamicsCrmRest = require("./src/dynamics");
require("dotenv").config();

class agentsController {
  async fetchAgentTuple(req, res) {
    let agentid =
      undefined === req.query.dynamics_id ||
      null === req.query.dynamics_id ||
      req.query.dynamics_id.match(/(^\s+$|^$)|((@|\||\*|\^|\_|%|!|~|\+)+)/i)
        ? `^invalid`
        : `(${req.query.dynamics_id})`;

    if ("^invalid" === agentid) {
      res.status(400).send({
        error: "No agent found with that UUID.",
      });
      return;
    }

    let crm = new DynamicsCrmRest();
    await crm.get(`cr4f2_agentsandrealtors${agentid}`).then((result) => {
      if (undefined !== result.data) {
        result.data.hotLink =
          process.env.dynamics_crm_record_link.replace(
            "{entity}",
            "cr4f2_agentsandrealtor"
          ) + result.data.cr4f2_agentsandrealtorid || 'undefined';
        res.json(result.data);
      } else {
        res.status(404).send({
          error:
            "No agent found with that UUID.",
        });
      }
    });
  }
}

module.exports = new agentsController();
