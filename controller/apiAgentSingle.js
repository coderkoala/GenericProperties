"use strict";
let DynamicsCrmRest = require("./src/dynamics");
let view = require("./src/agentViewHelper");
require("dotenv").config();

class agentsController {
  async fetchAgentTuple(req, res) {
    let renderAsTable = req.query.table || true;
    let agentid =
      undefined === req.query.id ||
      null === req.query.id ||
      req.query.id.match(/(^\s+$|^$)|((@|\||\*|\^|\_|%|!|~|\+)+)/i)
        ? `^invalid`
        : `(${req.query.id})`;

    if ("^invalid" === agentid) {
      res.status(400).send({
        title: "Failed retrieval",
        message: "Invalid UUID was provided. Please provide a valid UUID.",
        icon: "error",
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
          ) + result.data.cr4f2_agentsandrealtorid || "undefined";
        if (renderAsTable) {
          let viewInstance = new view();
          res.status(200).json({title:result.data.cr4f2_fullname,data: viewInstance.outputSingleAgent(result.data) });
          return;
        } else {
          res.json(result.data);
        }
      } else if (404=== result.response.status) {
        res.status(404).send({
          title: "Failed retrieval",
          message: "No agent found with that UUID.",
          icon: "error",
        });
      } else {
        res.status(400).send({
          title: "Failed retrieval",
          message: "The server was unable to process your request.",
          icon: "error",
        });
      }
    });
  }
}

module.exports = new agentsController();
