'use strict';

var express = require('express');
var router = express.Router();

// Import controllers.
const requireDir = require('require-dir');
const _ = requireDir('../controller');
const api = '/v1';

/* Backend for the system. */
router.get(`${api}/geolocation`, _.apiBase.view);
router.post(`${api}/geolocation`, _.apiBase.post);

// Zillow API Controller.
router.post(`${api}/zillow`, _.zillow.fetchXMLAPI);

// Email Endpoint.
router.post(`${api}/email`, _.email.sendEmail);

// Agent fetch single Endpoint.
router.post(`${api}/agent`, _.apiAgentSingle.fetchAgentTuple);

// Agent fetch computed results Endpoint.
router.post(`${api}/agents`, _.apiAgentMCached.fetchLeadsRelatedAgentsFromCache);

module.exports = router;
