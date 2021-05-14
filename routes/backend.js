'use strict';

var express = require('express');
var router = express.Router();

// Import controllers.
const requireDir = require('require-dir');
const _ = requireDir('../controller');
const api = '/v1';

/* Backend for the system. */
router.get(`${api}/geolocation`, _.api.view);
router.post(`${api}/geolocation`, _.api.post);

module.exports = router;
